export interface Cliente {
	id: number;
	telefon: string;
	correu: string;
	adreca: string;
}

export interface Clientes {
	clientes: Cliente[];
}

export interface Plato {
	nom: string;
	descripcio: string;
	preu: number;
}

export interface Platos {
	platos: Plato[];
}
