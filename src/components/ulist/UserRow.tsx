"use client";

import React, { useState } from "react";
import { updateUserPlan, deleteAccountByAdmin } from "@/app/actions/adminActions";
import { useUlist } from "./UlistContext";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

interface UserRowProps {
  user: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
    plan: string;
  };
}

export default function UserRow({ user }: UserRowProps) {
  const [selectedPlan, setSelectedPlan] = useState(user.plan === "free" ? "basic" : user.plan);
  const [loading, setLoading] = useState(false);
  const { showToast } = useUlist();
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserPlan(user.id, selectedPlan);
      showToast(`Plan de ${user.name || user.email} actualizado a ${selectedPlan.toUpperCase()}`, "success");
      router.refresh();
    } catch (error) {
      showToast("Error al actualizar el plan", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la cuenta de ${user.email}?`)) {
      setLoading(true);
      try {
        await deleteAccountByAdmin(user.id);
        showToast(`Cuenta de ${user.email} eliminada correctamente`, "success");
        router.refresh();
      } catch (error) {
        showToast("Error al eliminar la cuenta", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <tr className="hover:bg-base-200/50 transition-colors">
      <td>
        <div className="flex items-center gap-4">
          <div className="avatar online">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user.image || "/default-avatar.png"} alt="avatar" />
            </div>
          </div>
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-sm opacity-50">{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className={`badge badge-lg gap-2 ${
          ['pro', 'creador', 'admin'].includes(selectedPlan) ? 'badge-primary' 
          : selectedPlan !== 'basic' ? 'badge-secondary' 
          : 'badge-ghost opacity-50'
        }`}>
          {selectedPlan !== 'basic' ? `⭐ ${selectedPlan.toUpperCase()}` : 'BASIC'}
        </div>
      </td>
      <td className="text-center">
        <div className="flex items-center justify-center gap-2">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={loading}
            className="select select-bordered select-sm max-w-xs focus:select-primary transition-all"
          >
            <option value="basic">Basic</option>
            <option value="music">Music</option>
            <option value="learning">Learning</option>
            <option value="play">Play</option>
            <option value="pro">Pro</option>
            <option value="creador">Creador</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleSave}
            disabled={loading || selectedPlan === user.plan}
            className={`btn btn-sm btn-primary rounded-lg shadow-sm hover:shadow-md transition-all ${
              loading ? "loading loading-spinner" : ""
            }`}
          >
            {loading ? "" : "Guardar"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-sm btn-error btn-square rounded-lg shadow-sm hover:shadow-md transition-all ml-2"
            title="Eliminar cuenta"
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : <FaTrash />}
          </button>
        </div>
      </td>
    </tr>
  );
}
