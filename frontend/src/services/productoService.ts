const API_URL = 'http://127.0.0.1:8000/api/productos';

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
};

export type ProductoInput = Omit<Producto, 'id'>;

async function leerRespuesta<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Error al comunicarse con el servidor';
    throw new Error(message);
  }

  return data as T;
}

export async function listarProductos(): Promise<Producto[]> {
  const response = await fetch(API_URL, {
    headers: { Accept: 'application/json' },
  });
  return leerRespuesta<Producto[]>(response);
}

export async function crearProducto(producto: ProductoInput): Promise<Producto> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(producto),
  });
  return leerRespuesta<Producto>(response);
}

export async function actualizarProducto(
  id: number,
  producto: ProductoInput,
): Promise<Producto> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(producto),
  });
  return leerRespuesta<Producto>(response);
}

export async function eliminarProducto(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  await leerRespuesta<unknown>(response);
}