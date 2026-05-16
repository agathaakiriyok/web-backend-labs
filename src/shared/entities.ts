export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  orders: Order[];
}

export class Hall {
  id: number;
  name: string;
  capacity: number;
  exhibitions: Exhibition[];
  orderItems: OrderItem[];
}

export class Exhibition {
  id: number;
  name: string;
  description?: string;
  dateStart: Date;
  dateEnd: Date;
  hallId: number;
  hall: Hall;
  orderItems: OrderItem[];
}

export class Order {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  createdAt: Date;
  user: User;
  items: OrderItem[];
}

export class OrderItem {
  id: number;
  orderId: number;
  exhibitionId: number;
  hallId: number;
  quantity: number;
  unitPrice: number;
  order: Order;
  exhibition: Exhibition;
  hall: Hall;
}

export class Feedback {
  id: number;
  text: string;
  createdAt: Date;
  userId: number;
  user: User;
}