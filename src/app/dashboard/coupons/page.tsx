/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, FormEvent } from "react"
import { Coupon } from "@/src/shared/types/Coupon";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Separator } from "@/src/components/ui/separator"
import { Plus, Edit } from "lucide-react"
import { useToast } from "@/src/shared/hooks/use-toast"
import { useCreateCouponMutation, useGetCouponsQuery, useGetUsersQuery, useUpdateCouponMutation } from "@/src/shared/store/api";

import { MultiSelect } from "./../../../components/MultiSelect";

type CouponStatus = "ACTIVE" | "EXPIRED" | "INACTIVE"

export default function CouponsPage() {

  const { toast } = useToast();

  const [openDialog, setOpenDialog] = useState(false)
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null)

  // Campos del formulario
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState<string>("")
  const [status, setStatus] = useState<CouponStatus>("ACTIVE")
  const [maxLimit, setMaxLimit] = useState<number>(1)
  const [isUserStatus, setIsUserStatus] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { data: coupons = [], refetch } = useGetCouponsQuery();

  const { data: users = [] } = useGetUsersQuery();

  const [ createCoupon ] = useCreateCouponMutation();
  const [ updateCoupon ] = useUpdateCouponMutation();

  const options= [];

  users.forEach(user => {
    options.push({ label: user.documentNumber + ' - ' + user.name, value: user.id });
  });

  const clearForm = () => {
    setEditCoupon(null)
    setCode("")
    setDiscount("")
    setStatus("ACTIVE")
    setMaxLimit(0)
    setIsUserStatus(false)
    setStartDate("")
    setEndDate("")
    setSelectedUsers([])
  }

  const openEditForm = (coupon: Coupon) => {
    setEditCoupon(coupon)
    setCode(coupon.code)
    setDiscount(coupon.discountPercent.toString())
    setStatus(coupon.status)
    setMaxLimit(coupon.maxLimit)
    setIsUserStatus(coupon.isUserStatus)
    setStartDate(coupon.startDate)
    try {
      setSelectedUsers(["5", "6"])  
    } catch (error) {
      
    }
    
    setEndDate(coupon.endDate)
    setOpenDialog(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!code || !discount) {
      toast({ description: "Código y descuento son requeridos", variant: "destructive" })
      return
    }

    const formData = {
      code,
      discountPercentage: parseFloat(discount),
      status,
      limit: maxLimit,
      userStatus: isUserStatus,
      startDate,
      endDate,
      userIds: selectedUsers.map(userId => ({ id: userId })),
    }

    if (editCoupon) {
      // Actualizar cupón
      await updateCoupon({ id: editCoupon.id, updatedCoupon: { ...formData } })
      toast({ description: "Cupón actualizado", variant: "default" })
    } else {
      // Crear nuevo cupón
      await createCoupon({ ...formData });
      toast({ description: "Cupón creado", variant: "default" })
    }
    refetch();
    setOpenDialog(false)
    clearForm()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Gestión de Cupones</CardTitle>
        <CardDescription>Administra la lista de cupones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={openDialog} onOpenChange={(o)=>{ if(!o) clearForm(); setOpenDialog(o) }}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Cupón
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl max-h-[80vh] p-10 bg-white border rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle>{editCoupon ? "Editar Cupón" : "Crear Cupón"}</DialogTitle>
                <DialogDescription>Completa los campos para {editCoupon ? "actualizar" : "crear"} el cupón.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="coupon-code">Código</Label>
                  <Input id="coupon-code" value={code} onChange={e=>setCode(e.target.value)} required />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 flex flex-col space-y-1">
                    <Label htmlFor="coupon-discount">Descuento (%)</Label>
                    <Input id="coupon-discount" type="number" step="0.01" value={discount} onChange={e=>setDiscount(e.target.value)} min={1} max={100} required />
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <Label htmlFor="coupon-startDate">Fecha de Publicación</Label>
                    <Input id="coupon-startDate" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} required />
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <Label htmlFor="coupon-endDate">Fecha de Expiración</Label>
                    <Input id="coupon-endDate" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} required />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <Label>Numero de uso</Label>
                  <Input id="coupon-expiration" type="number" value={maxLimit} onChange={e=>setMaxLimit(parseInt(e.target.value))} required min={1} />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label>Estado</Label>
                  <Select value={status} onValueChange={(v)=>setStatus(v as CouponStatus)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Activo</SelectItem>
                      <SelectItem value="EXPIRED">Expirado</SelectItem>
                      <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1">
                  <Label>Uso global</Label>
                  <Select value={isUserStatus ? "1" : "0"} onValueChange={(v)=>setIsUserStatus(v === "1")} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Si</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {
                  isUserStatus &&
                  <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Listado de clientes frecuentes
                  </label>
                  <MultiSelect options={options} onValueChange={(selected) => setSelectedUsers(selected)} defaultValue={selectedUsers} />
                </div>
                }
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="default">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">{editCoupon ? "Actualizar" : "Crear"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Separator className="my-4" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Fecha de Publicación</TableHead>
              <TableHead>Fecha de Expiración</TableHead>
              <TableHead>Limite</TableHead>
              <TableHead>Uso global</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha de modificación</TableHead>
              <TableHead>Usuario que modifico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map(coupon => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountPercent}%</TableCell>
                <TableCell>{coupon.startDate}</TableCell>
                <TableCell>{coupon.endDate}</TableCell>
                <TableCell>{coupon.maxLimit}</TableCell>
                <TableCell>{coupon.isUserStatus ? "Si" : "No"}</TableCell>
                <TableCell>{coupon.status}</TableCell>
                <TableCell>2024-12-16 12:00:00</TableCell>
                <TableCell>Jose Dueñas</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" onClick={() => openEditForm(coupon)} className="mr-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
