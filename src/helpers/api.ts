import { PrismaClient } from "@prisma/client";
import 'dayjs/locale/pt-br'
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,
  headers: {
    "Content-Type": "application/json"
  }
});

let prisma: PrismaClient;

//check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  //check if there is already a connection to the database
  //@ts-ignore
  if (!global.prisma) {
    //@ts-ignore
    global.prisma = new PrismaClient()
  }
  //@ts-ignore
  prisma = global.prisma
}

export { prisma };