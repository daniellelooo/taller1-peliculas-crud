import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const SALT_ROUNDS = 10;

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /** Crea el usuario guardando SOLO el hash de la contrasena. */
  async register(dto: RegisterDto) {
    const existe = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('Ese correo ya esta registrado');
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { nombre: dto.nombre, email: dto.email, password: hash },
    });

    return this.buildSession(user.id, user.email, user.nombre);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.buildSession(user.id, user.email, user.nombre);
  }

  /** Firma el JWT y devuelve el usuario sin la contrasena. */
  private async buildSession(id: number, email: string, nombre: string) {
    const payload: JwtPayload = { sub: id, email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user: { id, email, nombre } };
  }
}
