import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {ITokenProvider} from '../ITokenProvider';

export class JwtProvider implements ITokenProvider {
  async verify(data: string): Promise<unknown> {
    try {
      const decoded = jwt.verify(data, 'S3cr3t');

      const object = Object.assign({decoded})

      return await Promise.resolve(object.decoded.data);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Error on verify token: ' + error.message);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async generate(data: any): Promise<string> {
    return jwt.sign({data}, 'S3cr3t', {
      expiresIn: '7h'
    });
  }
}
