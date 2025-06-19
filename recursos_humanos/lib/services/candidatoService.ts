import dbConnect from '@/lib/mongoose';
import Candidato from '@/models/Candidato';
import { Candidato as ICandidato } from '@/types/candidato';

export async function obtenerTodosLosCandidatos(): Promise<ICandidato[]> {
    await dbConnect();
    const candidatos = await Candidato.find({}).lean();
    return JSON.parse(JSON.stringify(candidatos));
}

export async function crearCandidato(data: Omit<ICandidato, 'id'>): Promise<ICandidato> {
    await dbConnect();
    const nuevoCandidato = new Candidato(data);
    const candidatoGuardado = await nuevoCandidato.save();
    return JSON.parse(JSON.stringify(candidatoGuardado));
}
//agregar modificar candidato

export async function eliminarCandidato(id: string): Promise<{ deletedCount?: number }> {
    await dbConnect();
    const resultado = await Candidato.deleteOne({ _id: id });
    return resultado;
}