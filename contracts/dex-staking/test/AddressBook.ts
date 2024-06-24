import { addressBookFixture } from '../fixtures';
import { expect } from 'chai';


describe('AddressBook', () => {
  it('should have token addresses', async () => {
    const { addressBook, ldtAddress, tbbAddress, tbsAddress, tbgAddress } = await addressBookFixture();

    const tokens = await addressBook.tokens();

    expect(tokens.ldt).eq(ldtAddress);
    expect(tokens.tbb).eq(tbbAddress);
    expect(tokens.tbs).eq(tbsAddress);
    expect(tokens.tbg).eq(tbgAddress);
  });

  it('should have farming addresses', async () => {
    const { addressBook, tbbFarmAddress, tbsFarmAddress, tbgFarmAddress } = await addressBookFixture();

    const farms = await addressBook.farms()

    expect(farms.tbb).eq(tbbFarmAddress)
    expect(farms.tbs).eq(tbsFarmAddress)
    expect(farms.tbg).eq(tbgFarmAddress)
  });

  it('should have staking addresses', async () => {
    const { addressBook, tbbStakerAddress, tbsStakerAddress, tbgStakerAddress } = await addressBookFixture();

    const stakers = await addressBook.stakers();

    expect(stakers.tbb).eq(tbbStakerAddress)
    expect(stakers.tbs).eq(tbsStakerAddress)
    expect(stakers.tbg).eq(tbgStakerAddress)
  });
});
