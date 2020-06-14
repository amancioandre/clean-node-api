import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('valid_hash'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values.', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return hash on success.', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashedValue = await sut.encrypt('any_value')
    expect(hashedValue).toBe('valid_hash')
  })
})
