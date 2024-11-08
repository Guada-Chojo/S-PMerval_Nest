import { Injectable } from "@nestjs/common";

@Injectable()
export class GempresaService {

    createClient = () => {
        const client = axios.create({
            baseURL: 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000'
        });
        return client;
    }
    public clientAxios = this.createClient();

    async getEmpresaDetails (codigoEmpresa: string): Promise<IEmpresa>{
        try{
            const respuesta AxiosResponse<any, any> = await this.clientAxios.get(`/empresas/${codigoEmpresa}/details`);
            return respuesta.data;
        } catch {
            
        }
    }
}