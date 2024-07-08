import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
const iv = randomBytes(16);
export const formatedResponse = (
  message: string,
  code: number,
  status: string,
  data: any,
) => {
  return {
    message,
    data,
    status,
    code,
  };
};
export const generateHash = async (value: string): Promise<string> => {
  const sPin = await bcrypt.hash(value, 10);
  return sPin;
};

export function generateSlug(input: string, count?: number): string {
  let slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with dashes
    .replace(/--+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

  // Append count if provided
  if (count !== undefined && count !== null) {
    slug = `${count}-${slug}`;
  }

  return slug;
}

export const isValidObjectId = (id: string) => {
  // return mongoose.isValidObjectId(id);
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  } else {
    return false;
  }
};

export function isMultipleOf10(number: number): boolean {
  return number % 10 === 0;
}

