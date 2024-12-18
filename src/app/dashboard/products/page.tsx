/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, FormEvent } from "react"
import { Product } from "@/src/shared/types/Product"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Plus, Edit } from "lucide-react"
import { useToast } from "@/src/shared/hooks/use-toast"
import { useCreateProductMutation, useGetProductsQuery, useUpdateProductMutation } from "@/src/shared/store/api"

type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE"

export default function ProductsPage() {
  const { toast } = useToast();

    // Filtros
    const [filterName, setFilterName] = useState("")
    const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE">("ALL")
    const [filterBrand, setFilterBrand] = useState("")
  

  // API hooks
  const { data: products = [], refetch } = useGetProductsQuery({ name: filterName, tradeMark: filterBrand, status: filterStatus });
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()

  const [openDialog, setOpenDialog] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // Campos del formulario
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [status, setStatus] = useState< "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE">("ACTIVE")
  const [brand, setBrand] = useState("")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageFileUrl, setImageUrl] = useState("")

  useEffect(() => {
  }, [products])

  const clearForm = () => {
    setEditProduct(null)
    setName("")
    setPrice(0)
    setStock(0)
    setStatus("ACTIVE")
    setBrand("")
    setDescription("")
    setImageFile(null)
    setImageUrl("")
  }

  const openEditForm = (product: Product) => {
    setEditProduct(product)
    setName(product.name)
    setPrice(product.price)
    setStock((product.stock))
    setStatus(product.status)
    setBrand(product.tradeMark || "")
    setDescription(product.description || "")
    setImageUrl(product.image || "")
    setOpenDialog(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !price || !brand) {
      toast({ description: "Name, price y marca son requeridos", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price.toString())
    formData.append("stock", stock.toString())
    formData.append("status", status)
    formData.append("brand", brand)
    formData.append("description", description)
    if (imageFile) {
      formData.append("image", imageFile)
    }

    if (editProduct) {
      // Actualizar producto
      await updateProduct({
        id: editProduct.id,
        updatedProduct: { name, price, stock: stock, status, tradeMark: brand, description, image: imageFileUrl }
      })
      toast({ description: "Producto actualizado", variant: "default" });
    } else {
      // Crear nuevo producto
      await createProduct({
        name,
        price: price,
        stock: stock,
        status,
        tradeMark: brand,
        description,
        image: imageFileUrl
      })
      toast({ description: "Producto creado", variant: "default" });
    }
    refetch();

    setOpenDialog(false)
    clearForm()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Gestión de Productos</CardTitle>
        <CardDescription>Administra la lista de productos</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex items-end justify-end mb-4">
        <Button onClick={() => setOpenDialog(true)} className="">
            <Plus className="mr-2" /> Agregar Producto
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Buscar por nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ProductStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ACTIVE">Activo</SelectItem>
              <SelectItem value="INACTIVE">Inactivo</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Agotado</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Buscar por marca"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
          />
        </div>

        {/* Tabla de productos */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de modificación</TableHead>
              <TableHead>Usuario que modifico</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell><img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                /></TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>2024-12-16 12:00:00</TableCell>
                <TableCell>Jose Dueñas</TableCell>
                <TableCell>
                  <Button onClick={() => openEditForm(product)} className="mr-2">
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo de creación/edición de productos */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProduct ? "Editar Producto" : "Crear Producto"}</DialogTitle>
            <DialogDescription>
              {editProduct ? "Modifica los detalles del producto." : "Ingresa los detalles del nuevo producto."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                required
                min={0}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="status">Estado</Label>
              <Select value={status} onValueChange={(v)=>setStatus(v as ProductStatus)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="image">Imagen</Label>
              <div className="flex items-center justify-center">
              <Input
                id="image"
                value={imageFileUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
                {
                  imageFileUrl &&
                  <img src={imageFileUrl} alt="Producto" className="w-16 h-16 object-cover rounded p-1" />
                }
              </div>
             
              {/* <Input
                id="image"
                type="file"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              /> */}
              
            </div>
            <DialogFooter>
              <Button type="submit">{editProduct ? "Actualizar" : "Crear"}</Button>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
