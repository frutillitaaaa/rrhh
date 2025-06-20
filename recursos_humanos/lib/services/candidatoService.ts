import dbConnect from '@/lib/mongoose';
import Candidato from '@/models/Candidato';
import { Candidato as ICandidato } from '@/types/candidato';

export async function obtenerTodosLosCandidatos(): Promise<ICandidato[]> {
    try {
        await dbConnect();
        return await Candidato.find({}).lean();
    } catch (error) {
        console.error("Error en obtenerTodosLosCandidatos:", error);
        throw new Error("No se pudieron obtener los candidatos.");
    }
}

export async function obtenerCandidatoPorId(id: string): Promise<ICandidato | null> {
    try {
        await dbConnect();
        return await Candidato.findById(id).lean();
    } catch (error) {
        console.error(`Error en obtenerCandidatoPorId con id ${id}:`, error);
        throw new Error("No se pudo obtener el candidato.");
    }
}

export async function crearCandidato(data: ICandidato): Promise<ICandidato> {
    try {
        await dbConnect();
        const nuevoCandidato = new Candidato(data);
        return await nuevoCandidato.save();
    } catch (error) {
        console.error("Error en crearCandidato:", error);
        throw new Error("No se pudo crear el candidato.");
    }
}

export async function actualizarCandidato(id: string, data: Partial<ICandidato>): Promise<ICandidato | null> {
    try {
        await dbConnect();
        return await Candidato.findByIdAndUpdate(id, data, { new: true }).lean();
    } catch (error) {
        console.error(`Error en actualizarCandidato con id ${id}:`, error);
        throw new Error("No se pudo actualizar el candidato.");
    }
}

export async function eliminarCandidato(id: string): Promise<{ deletedCount?: number }> {
    try {
        await dbConnect();
        return await Candidato.deleteOne({ _id: id });
    } catch (error) {
        console.error(`Error en eliminarCandidato con id ${id}:`, error);
        throw new Error("No se pudo eliminar el candidato.");
    }
}