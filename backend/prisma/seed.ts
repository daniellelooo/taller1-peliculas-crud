import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const peliculas = [
  {
    nombre: 'El Padrino',
    imagen: 'https://image.tmdb.org/t/p/w500/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg',
    director: 'Francis Ford Coppola',
    anio: 1972,
    genero: 'Drama',
    sinopsis: 'El patriarca de una dinastia del crimen organizado traspasa el control a su hijo menor.',
  },
  {
    nombre: 'Pulp Fiction',
    imagen: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    director: 'Quentin Tarantino',
    anio: 1994,
    genero: 'Crimen',
    sinopsis: 'Las vidas de dos sicarios, un boxeador y una pareja de atracadores se entrelazan.',
  },
  {
    nombre: 'Matrix',
    imagen: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    director: 'Lana y Lilly Wachowski',
    anio: 1999,
    genero: 'Ciencia ficcion',
    sinopsis: 'Un programador descubre que la realidad es una simulacion controlada por maquinas.',
  },
  {
    nombre: 'Interestelar',
    imagen: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    director: 'Christopher Nolan',
    anio: 2014,
    genero: 'Ciencia ficcion',
    sinopsis: 'Un grupo de exploradores viaja por un agujero de gusano buscando un nuevo hogar.',
  },
  {
    nombre: 'Parasitos',
    imagen: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    director: 'Bong Joon-ho',
    anio: 2019,
    genero: 'Thriller',
    sinopsis: 'Una familia humilde se infiltra poco a poco en la vida de una familia adinerada.',
  },
  {
    nombre: 'Ciudad de Dios',
    imagen: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg',
    director: 'Fernando Meirelles',
    anio: 2002,
    genero: 'Crimen',
    sinopsis: 'Dos jovenes toman caminos opuestos en una favela de Rio de Janeiro.',
  },
  {
    nombre: 'Spirited Away',
    imagen: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    director: 'Hayao Miyazaki',
    anio: 2001,
    genero: 'Animacion',
    sinopsis: 'Una nina queda atrapada en un mundo de espiritus y debe rescatar a sus padres.',
  },
  {
    nombre: 'El Senor de los Anillos: La Comunidad del Anillo',
    imagen: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    director: 'Peter Jackson',
    anio: 2001,
    genero: 'Fantasia',
    sinopsis: 'Un hobbit emprende el viaje para destruir un anillo capaz de dominar la Tierra Media.',
  },
  {
    nombre: 'Whiplash',
    imagen: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    director: 'Damien Chazelle',
    anio: 2014,
    genero: 'Drama',
    sinopsis: 'Un joven baterista es llevado al limite por un instructor implacable.',
  },
  {
    nombre: 'Coco',
    imagen: 'https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg',
    director: 'Lee Unkrich',
    anio: 2017,
    genero: 'Animacion',
    sinopsis: 'Un nino viaja a la Tierra de los Muertos para descubrir el secreto de su familia.',
  },
  {
    nombre: 'Mad Max: Furia en la Carretera',
    imagen: 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
    director: 'George Miller',
    anio: 2015,
    genero: 'Accion',
    sinopsis: 'En un desierto postapocaliptico, Max ayuda a un grupo de fugitivas a escapar.',
  },
  {
    nombre: 'El Laberinto del Fauno',
    imagen: 'https://image.tmdb.org/t/p/w500/z7xXihu5wHuSMWymq5VAulPVuvg.jpg',
    director: 'Guillermo del Toro',
    anio: 2006,
    genero: 'Fantasia',
    sinopsis: 'Una nina encuentra un mundo magico en plena posguerra civil espanola.',
  },
];

async function main() {
  await prisma.movie.deleteMany();
  await prisma.movie.createMany({ data: peliculas });

  const email = 'demo@peliculas.com';
  const password = await bcrypt.hash('demo1234', 10);
  const existe = await prisma.user.findUnique({ where: { email } });
  if (!existe) {
    await prisma.user.create({
      data: { nombre: 'Usuario Demo', email, password },
    });
  }

  console.log(`Seed listo: ${peliculas.length} peliculas y el usuario ${email} (password: demo1234)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
