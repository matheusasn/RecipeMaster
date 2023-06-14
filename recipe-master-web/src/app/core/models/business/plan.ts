import { PerfilEnum } from "../security/perfil.enum";
import { PaymentAPI } from "./payment-api";

export enum PagseguroStatus {
    AGUARDANDO = "AGUARDANDO",
	ANALISE = "ANALISE",
	PAGA = "PAGA",
	DISPONIVEL = "DISPONIVEL",
	DISPUTA = "DISPUTA",
	DEVOLVIDA = "DEVOLVIDA",
	CANCELADA = "CANCELADA"
}

export enum PaypalStatus {
    UNDEFINED = 0,
    COMPLETED = 1
}

export enum MercadopagoStatus {
	APPROVED = "approved"
}

export interface PlanDateUpdate {
	date: Date;
	userId: number;
}

export interface Plan {

    perfil?: PerfilEnum;
    api?: PaymentAPI;

    expiration?: Date;
		inclusion?: Date;

    pagseguroTransactionId?: string;
    pagseguroTransactionStatus?: PagseguroStatus;

    paypalOrderId?: string;
    paypalOrderStatus?: PaypalStatus;

}
