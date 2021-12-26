import { Addresses, Verify, AddressesType } from "../common"

const verify = async (c: AddressesType): Promise<void> => {
    // await Verify(c.addresses, [])
    // await Verify(c.frontier, [c.addresses])
    // await Verify(c.status, [c.addresses])
    // await Verify(c.hp, [c.addresses])
    // await Verify(c.descriptor, [c.addresses])
    // await Verify(c.character, [c.addresses])
    // await Verify(c.reward, [c.addresses])
    // await Verify(c.staking, [c.addresses])
    // await Verify(c.token, [c.addresses])
    // await Verify(c.logic, [c.addresses])
    // await Verify(c.mintLogic, [c.addresses])

    // await Verify(c.FROStatus, [c.addresses])
    // await Verify(c.FROHp, [c.addresses])
    // await Verify(c.FROCharacter, [c.addresses])
    await Verify(c.FROTokenDescriptor, [c.addresses])
}

const main = async () => {
    const addresses = Addresses()!

    await verify(addresses)
    // await Verify("0x77776B57dcE93577a3537aF466Bfe46eC596eeC8", [addresses.addresses])
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

