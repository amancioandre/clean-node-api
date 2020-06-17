import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

describe('Required Field Validation', () => {
  test('Should return a MissinParamError if validation fails.', () => {
    const { sut } = makeSut()
    const error = sut.validate({ otherField: 'otherField' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if valitation succeds.', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
