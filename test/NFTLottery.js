const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("NFTLottery", function () {

    let nftLotteryInstance;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addrs;

    before(async () => {
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

        const NFTLottery = await ethers.getContractFactory("NFTLottery");
        nftLotteryInstance = await NFTLottery.deploy();
    });

    it("Should get initial balance and owner", async function () {
        expect(await nftLotteryInstance.owner()).to.equal(owner.address);
    });

    it("Should mint", async function () {
        await nftLotteryInstance.mintTicket('', 2, {
            value: 2000000000000000
        });
        expect(await nftLotteryInstance.getTicketsForAddress(owner.address)).to.eql([BigNumber.from(1), BigNumber.from(2)]);
    });

    it("Should mint", async function () {
        await nftLotteryInstance.connect(addr1).mintTicket('', 2, {
            value: 2000000000000000
        });
        expect(await nftLotteryInstance.getTicketsForAddress(addr1.address)).to.eql(
            [BigNumber.from(3), BigNumber.from(4)]
        );

        await nftLotteryInstance.mintTicket('', 1, {
            value: 1000000000000000
        });
        expect(await nftLotteryInstance.getTicketsForAddress(owner.address)).to.eql(
            [BigNumber.from(1), BigNumber.from(2), BigNumber.from(5)]
        );
    });

    it("Should not grant community tickets if not owner or if too many are attempted", async function () {
        try {
            await nftLotteryInstance.connect(addr1).mintTicketsForCommunityMember(addr1.address, '', 2);
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        try {
            await nftLotteryInstance.connect(addr1).mintTicketForCommunityMembers([owner.address, addr1.address], '');
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
        }

        try {
            await nftLotteryInstance.mintTicketsForCommunityMember(addr1.address, '', 5);
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'This many community tickets do not remain.'");
        }

        try {
            await nftLotteryInstance.mintTicketForCommunityMembers([owner.address, addr1.address, addr2.address, addr3.address, addr4.address], '');
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'This many community tickets do not remain.'");
        }
    });

    it("Should grant community tickets", async function () {

        await nftLotteryInstance.mintTicketsForCommunityMember(addr1.address, '', 2);
        expect(await nftLotteryInstance.getTicketsForAddress(addr1.address)).to.eql(
            [BigNumber.from(3), BigNumber.from(4), BigNumber.from(6), BigNumber.from(7)]
        );

        try {
            await nftLotteryInstance.mintTicketsForCommunityMember(addr1.address, '', 4);
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'This many tickets do not remain.'");
        }

        try {
            await nftLotteryInstance.mintTicketForCommunityMembers([owner.address, addr1.address, addr2.address, addr3.address], '');
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'This many tickets do not remain.'");
        }

        await nftLotteryInstance.mintTicketForCommunityMembers([owner.address, addr1.address], '');
        expect(await nftLotteryInstance.getTicketsForAddress(owner.address)).to.eql(
            [BigNumber.from(1), BigNumber.from(2), BigNumber.from(5), BigNumber.from(8)]
        );
        expect(await nftLotteryInstance.getTicketsForAddress(addr1.address)).to.eql(
            [BigNumber.from(3), BigNumber.from(4), BigNumber.from(6), BigNumber.from(7), BigNumber.from(9)]
        );

        await nftLotteryInstance.mintTicket('', 1, {
            value: 1000000000000000
        });
        expect(await nftLotteryInstance.getTicketsForAddress(owner.address)).to.eql(
            [BigNumber.from(1), BigNumber.from(2), BigNumber.from(5), BigNumber.from(8), BigNumber.from(10)]
        );
    });

    it("Should not grant tickets when sold out", async function () {
        try {
            await nftLotteryInstance.mintTicketsForCommunityMember(addr1.address, '', 2);
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'Tickets are sold out.'");
        }

        try {
            await nftLotteryInstance.mintTicketForCommunityMembers([addr1.address], '');
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'Tickets are sold out.'");
        }

        try {
            await nftLotteryInstance.mintTicket('', 1, {
                value: 1000000000000000
            });
        } catch (e) {
            expect(e.message).to.eql("VM Exception while processing transaction: reverted with reason string 'Tickets are sold out.'");
        }
    })
});