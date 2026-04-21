import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ExhibitionService {
  constructor(private prisma: PrismaService) {}

  private withImage<T extends { id: number }>(exhibition: T) {
    return {
      ...exhibition,
      image: `/img/${exhibition.id}.jpg`,
    };
  }

  async findAll() {
    let exhibitions = await this.prisma.exhibition.findMany({ include: { hall: true } });
    if (exhibitions.length === 0) {
      // Seed data
      const hall = await this.prisma.hall.upsert({
        where: { id: 1 },
        update: {},
        create: {
          name: 'Главный зал',
          capacity: 100,
        },
      });
      await this.prisma.exhibition.createMany({
        data: [
          {
            name: 'Искусство портрета',
            description: 'Выставка посвящена всемирной истории портрета, от зарождения портретных форм до наших дней. Для выставки отобраны лучшие образцы портретного искусства из собрания Эрмитажа, представляющие разные исторические эпохи и цивилизации. Коллекция Государственного Эрмитажа позволяет проиллюстрировать портрет в различных видах искусства: в скульптуре, живописи, графике, прикладном искусстве, нумизматике, фотографии. Всего будет показано около 600 музейных предметов.',
            dateStart: new Date('2025-12-08'),
            dateEnd: new Date('2026-03-29'),
            hallId: hall.id,
          },
          {
            name: '14 декабря 1825 года',
            description: 'Выставка посвящена восстанию декабристов, состоявшемуся на Сенатской площади в Санкт-Петербурге 14 декабря 1825 года. Наряду с победой в Отечественной войне 1812 года это событие до Октябрьской революции 1917 года считалось важнейшим в жизни страны. Выставка готовится совместно с Государственным архивом Российской Федерации.',
            dateStart: new Date('2025-12-13'),
            dateEnd: new Date('2026-04-05'),
            hallId: hall.id,
          },
          {
            name: 'Музейный детектив',
            description: 'Выставка посвящена одному из уникальных произведений античной пластики – позолоченной бронзовой статуе «Виктория Кальватоне». Созданные для выставки 3D-модели позволят прикоснуться к вечности буквально кончиками пальцев. Предполагается новый, инновационный формат метаиммерсивной выставки с элементами детективного расследования. Выставка должна стереть грань между виртуальным и реальным миром и превратить застывшее окружающее пространство в движущийся интерактивный мир, наполненный яркими художественными образами.',
            dateStart: new Date('2026-02-15'),
            dateEnd: new Date('2026-05-31'),
            hallId: hall.id,
          },
          {
            name: 'Бернардино Луини',
            description: '17 октября 2025 года в Аполлоновом зале Зимнего дворца открылась выставка, посвящённая одному из важнейших последователей Леонардо да Винчи и крупнейшему художнику ломбардской школы живописи эпохи Ренессанса, — «Бернардино Луини. К завершению реставрации». В эрмитажном собрании три работы Бернардино Луини, и все они показаны на выставке: «Святой Себастьян», «Святая Екатерина» и «Распятие с Мадонной, святыми Павлом, Марией Магдалиной, Иоанном и Франциском».',
            dateStart: new Date('2025-10-18'),
            dateEnd: new Date('2025-11-23'),
            hallId: hall.id,
          },
          {
            name: 'Уголок Эребуни в Эрмитаже',
            description: '5 февраля 2024 года в зале Культуры и искусства Урарту открывается выставка «Уголок Эребуни в Эрмитаже». История раскопок двух урартских крепостей превратила урартологию из филологической науки в историческую. Сенсационные массовые находки уникальных вещей в погибшем при штурме Кармир-блуре / Тейшебаини сделали урартскую культуру осязаемой. Раскопки Арин-берда порадовали всех фресками и потрясли именем Эребуни. История города приобрела другое измерение.',
            dateStart: new Date('2024-02-15'),
            dateEnd: new Date('2026-02-15'),
            hallId: hall.id,
          },
        ],
      });
      exhibitions = await this.prisma.exhibition.findMany({ include: { hall: true } });
    }
    return exhibitions.map((exhibition) => this.withImage(exhibition));
  }

  async findOne(id: number) {
    const exhibition = await this.prisma.exhibition.findUnique({
      where: { id },
      include: { hall: true },
    });

    return exhibition ? this.withImage(exhibition) : null;
  }

  create(data: { name: string; description: string; dateStart: string; dateEnd: string; hallId: number }) {
    return this.prisma.exhibition.create({
      data: {
        name: data.name,
        description: data.description,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        hallId: Number(data.hallId),
      },
    });
  }

  update(id: number, data: { name: string; description: string; dateStart: string; dateEnd: string; hallId: number }) {
    return this.prisma.exhibition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        hallId: Number(data.hallId),
      },
    });
  }

  remove(id: number) {
    return this.prisma.exhibition.delete({ where: { id } });
  }
}
