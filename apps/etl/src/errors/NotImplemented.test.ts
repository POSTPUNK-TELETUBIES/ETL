import { describe, expect, it } from "vitest";
import { NotImplementedError } from "./NotImplemented";

const error = new NotImplementedError('fakeMethodName', 'FakeClassName')

const throwNotImplemented = ()=>{ throw new NotImplementedError('a', 'b')}

describe('Not Implemented Error', ()=>{
  it('Formats message', ()=>{
    expect(error.message).toBe('Method fakeMethodName in class FakeClassName is not implemented')
  })

  it('Throws', ()=>{
    expect(throwNotImplemented).toThrow(/a/)
  })
})