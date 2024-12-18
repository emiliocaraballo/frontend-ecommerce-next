"use client";
import { useEffect, useState, FormEvent } from "react";
import { User } from "@/src/shared/types/User";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/src/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import { useToast } from "@/src/shared/hooks/use-toast";
import { useCreateUserMutation, useGetUsersQuery, useUpdateUserMutation } from "@/src/shared/store/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";


type UserRol = "ADMIN" | "CLIENT"

export default function UsersPage() {

  const { toast } = useToast();

  const { data: users = [], refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // const [searchQuery, setSearchQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserDocumentNumber, setNewUserDocumentNumber] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserRol, setNewUserRol] = useState<UserRol>("CLIENT")
  

  useEffect(() => {
  }, [/*searchQuery*/, users]);

  const handleCreateOrUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPass || !newUserLastName || !newUserPhone || !newUserDocumentNumber) {
      toast({ description: "Todos los campos son requeridos", variant: "destructive" });
      return;
    }

    if (editUser) {
      // Actualizar usuario existente
      await updateUser({ id: editUser.id, updatedUser: { name: newUserName, email: newUserEmail, password: newUserPass, lastName: newUserLastName, phone: newUserPhone, rol: newUserRol, documentNumber: newUserDocumentNumber, documentType: "CC" } });
      toast({ description: "Usuario actualizado con éxito", variant: "default" });
    } else {
      // Crear nuevo usuario
      await createUser({ name: newUserName, email: newUserEmail, password: newUserPass, lastName: newUserLastName, phone: newUserPhone, rol:  newUserRol, documentNumber: newUserDocumentNumber, documentType: "CC" });
      toast({ description: "Usuario creado con éxito", variant: "default" });
    }

    setOpenDialog(false);
    clearForm();
    refetch();
  };

  const clearForm = () => {
    setEditUser(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPass("");
    setNewUserLastName("");
    setNewUserPhone("");
    setNewUserDocumentNumber("");
    setNewUserRol(null);
  };

  const openEditForm = (user: User) => {
    setEditUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserPass(user.password);
    setNewUserLastName(user.lastName);
    setNewUserPhone(user.phone);
    setNewUserDocumentNumber(user.documentNumber);
    setNewUserRol(user.rol == 'ADMIN' ? 'ADMIN' : 'CLIENT');
    setOpenDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
        <CardDescription>Administra la lista de usuarios, crea nuevos, edita</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4">
           <div className="relative">
            {/*
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
             */}
          </div>

          <Dialog open={openDialog} onOpenChange={(o) => { if (!o) clearForm(); setOpenDialog(o); }}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editUser ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
                <DialogDescription>Completa los campos para {editUser ? "actualizar" : "crear"} un usuario.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrUpdateUser} className="space-y-4 mt-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-documentNumber">Nro. documento</Label>
                  <Input id="user-documentNumber" value={newUserDocumentNumber} onChange={(e) => setNewUserDocumentNumber(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label>Rol</Label>
                  <Select value={newUserRol} onValueChange={(v)=>setNewUserRol(v as UserRol)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-name">Nombre</Label>
                  <Input id="user-name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}  required />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-lastName">Apellido</Label>
                  <Input id="user-lastName" value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)}  required />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-email">Email</Label>
                  <Input id="user-email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-phone">Celular</Label>
                  <Input id="user-phone" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="user-pass">Contraseña</Label>
                  <Input id="user-pass" type="password" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} required />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="default">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">{editUser ? "Actualizar" : "Crear"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-4" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de documento</TableHead>
              <TableHead>Nro. documento</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de modificación</TableHead>
              <TableHead>Usuario que modifico</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.documentType}</TableCell>
                  <TableCell>{u.documentNumber}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.lastName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    <Badge variant={u.rol === "ADMIN" ? "secondary" : "outline"}>{u.rol}</Badge>
                  </TableCell>
                  <TableCell>2024-12-16 12:00:00</TableCell>
                  <TableCell>Jose Dueñas</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(u)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
