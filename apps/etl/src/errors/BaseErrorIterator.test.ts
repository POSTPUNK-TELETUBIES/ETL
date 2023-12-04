import { describe, expect, it } from "vitest";
import { BaseErrorIterator } from "./BaseErrorIterator";
import { NotImplementedError } from "./NotImplemented";


interface IDummyService{
  execute(): string;
}

class DummyService implements IDummyService{
  execute(){
    return 'fake data';
  }
}


class DummyServiceWithError implements IDummyService{
  execute(): string{
    throw new Error('fake error')
  }
}

class DummyServiceWithNotImplementedError implements IDummyService{
  execute(): string{
    throw new NotImplementedError('execute', this.constructor.name)
  }
}

class FakeErrorIterator extends BaseErrorIterator<DummyService>{
  async execute(){
    return await this.iterate((dummyService)=> Promise.resolve(dummyService.execute()))
  }
}



describe.concurrent('Error iterator proxy', ()=>{
  it('Executes with no error', async ()=>{
    const iterator = new FakeErrorIterator([{
      item: new DummyService(),
    }])

    const data = await iterator.execute()

    expect(data).toBe('fake data')
  })

  it('Executes Second', async ()=>{
    const iterator = new FakeErrorIterator([
      {
        item: new DummyServiceWithError(),
        continueOnError: true,
      },
      {
        item: new DummyService()
      }
    ])
    const data = await iterator.execute()
  
    expect(data).toBe('fake data')
  })

  it('Throws Error', async ()=>{
    const iterator = new FakeErrorIterator([
      {
        item: new DummyServiceWithError(),
      },
      {
        item: new DummyService()
      }
    ])
  
    await expect(iterator.execute).rejects.toThrowError()
  })


  it('Executes Second because of not implemented', async ()=>{
    const iterator = new FakeErrorIterator([
      {
        item: new DummyServiceWithNotImplementedError(),
      },
      {
        item: new DummyService()
      }
    ])
    const data = await iterator.execute()
  
    expect(data).toBe('fake data')
  })

  it('Executes Third because of not implemented', async ()=>{
    const iterator = new FakeErrorIterator([
      {
        item: new DummyServiceWithNotImplementedError(),
      },
      {
        item: new DummyServiceWithError(),
        continueOnError: true
      },
      {
        item: new DummyService()
      }
    ])
    const data = await iterator.execute()
  
    expect(data).toBe('fake data')
  })
})