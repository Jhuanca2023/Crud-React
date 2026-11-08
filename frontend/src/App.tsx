import { useEffect, useState, type FormEvent } from 'react';
import {
  crearProducto,
  listarProductos,
  type Producto,
  type ProductoInput,
} from './services/productoService';

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const nuevoProducto: ProductoInput = {
      nombre: nombre.trim(),
      precio: Number(precio),
      stock: Number(stock),
    };

    setGuardando(true);
    try {
      const productoCreado = await crearProducto(nuevoProducto);
      setProductos((actuales) => [...actuales, productoCreado]);
      setNombre('');
      setPrecio('');
      setStock('');
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Error al agregar producto');
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <main className='min-h-screen w-full bg-gray-100 px-4 py-8 text-left sm:px-8'>
      <div className='mx-auto w-full max-w-4xl'>
        <h1 className='mb-6 text-3xl font-bold'>CRUD de productos</h1>

        <section className='mb-8 rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Agregar producto</h2>
          <form onSubmit={agregarProducto} className='grid gap-4 sm:grid-cols-4 sm:items-end'>
            <label className='flex flex-col gap-1 text-sm font-medium text-gray-700'>
              Nombre
              <input
                type='text'
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
                maxLength={255}
                className='rounded border border-gray-300 px-3 py-2 font-normal'
                placeholder='Nombre del producto'
              />
            </label>

            <label className='flex flex-col gap-1 text-sm font-medium text-gray-700'>
              Precio (S/)
              <input
                type='number'
                value={precio}
                onChange={(event) => setPrecio(event.target.value)}
                required
                min='0'
                step='0.01'
                className='rounded border border-gray-300 px-3 py-2 font-normal'
                placeholder='0.00'
              />
            </label>

            <label className='flex flex-col gap-1 text-sm font-medium text-gray-700'>
              Stock
              <input
                type='number'
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
                min='0'
                step='1'
                className='rounded border border-gray-300 px-3 py-2 font-normal'
                placeholder='0'
              />
            </label>

            <button
              type='submit'
              disabled={guardando}
              className='rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {guardando ? 'Guardando...' : 'Agregar producto'}
            </button>
          </form>

          {error && (
            <p role='alert' className='mt-4 text-sm text-red-600'>
              {error}
            </p>
          )}
        </section>

        <section className='rounded-lg bg-white p-6 shadow'>
          <h2 className='mb-4 text-xl font-semibold'>Productos registrados</h2>

          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            productos.length === 0 ? (
              <p>No hay productos registrados.</p>
            ) : (
              <ul className='space-y-2'>
                {productos.map((producto) => (
                  <li key={producto.id} className='rounded border p-3'>
                    {producto.nombre} - S/ {producto.precio} - Stock: {producto.stock}
                  </li>
                ))}
              </ul>
            )
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
