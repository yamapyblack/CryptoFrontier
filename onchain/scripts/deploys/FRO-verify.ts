import { Addresses, Verify, AddressesType } from "../common"

const verify = async (a: AddressesType): Promise<void> => {
    await Verify(a.addresses, [])

    // await Verify(a.frontier, [a.addresses])
    // await Verify(a.status, [a.addresses])
    // await Verify(a.hp, [a.addresses])
    // await Verify(a.descriptor, [a.addresses])
    // await Verify(a.character, [a.addresses])
    // await Verify(a.reward, [a.addresses])
    // await Verify(a.staking, [a.addresses])
    // await Verify(a.token, [a.addresses])
    // await Verify(a.logic, [a.addresses])
    // await Verify(a.mintLogic, [a.addresses])

    await Verify(a.FROStatus, [a.addresses])
    await Verify(a.FROHp, [a.addresses])
    await Verify(a.FROSvg, [])
    await Verify(a.FROTokenDescriptor, [a.addresses])
    await Verify(a.FROCharacter, [a.addresses])
    await Verify(a.FROMintLogic, [a.addresses])
}

const main = async () => {
    const a = Addresses()!

    await verify(a)
    // await Verify("0x77776B57dcE93577a3537aF466Bfe46eC596eeC8", [addresses.addresses])
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

