// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/IStatus.sol";

contract FROTokenDescriptor is ITokenDescriptor, FROAddressesProxy, Ownable {
    /**
     * tokenId
     * prefix 1
     * character digit 2-3
     * weapon digit 4-5
     * color  digit 6-7
     * serial digit 8-10
     * e.g.) 1010101001
     */

    using Strings for uint256;

    string[32] positions = ["0","10","20","30","40","50","60","70","80","90","100","110","120","130","140","150","160","170","180","190","200","210","220","230","240","250","260","270","280","290","300","310"];

    //mapping(x => mapping(y => rgb))
    mapping(uint => mapping(uint => string)) weaponPixels;

    constructor(address registry_) FROAddressesProxy(registry_) {}

    // mapping(uint => mapping(uint => string)) basePixels;

    // function setPixels(ITokenDescriptor.Pixel[] memory _pixels) external {
    //     for(uint16 i = 0; i < _pixels.length; i++){
    //         basePixels[_pixels[i].x][_pixels[i].y] = _pixels[i].rgb;
    //     }
    // }

    function setWeaponPixels(ITokenDescriptor.Pixel[] memory _pixels) external {
        for(uint16 i = 0; i < _pixels.length; i++){
            weaponPixels[_pixels[i].x][_pixels[i].y] = _pixels[i].rgb;
        }
    }

    function generateName(uint256 tokenId)
        private
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "CryptoFrontier Character #",
                    tokenId.toString()
                )
            );
    }

    function generateDescription(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "CryptoFrontier Character #",
                    tokenId.toString(),
                    "\n\nCryptoFrontier is the Full On-chained Game by FrontierDAO.\n\nFull On-chained Game is the game where all the data of the game is stored on-chain. Not only the NFTs, but also character's status, skills, battle results and even the battle logic are recorded on-chain.",
                    "\nhttps://medium.com/@yamapyblack/full-on-chained-game-by-frontierdao-b8e50549811d"
                )
            );
    }

    function generateAttributes(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        IStatus status = IStatus(
            registry.getRegistry("FROStatus")
        );

        IStatus.Status memory st = status.getStatus(tokenId);

        string[7] memory trait_types = ["hp", "at", "df", "it", "sp", "color", "weapon"];
        string[7] memory values = [
            st.hp.toString(),
            st.at.toString(),
            st.df.toString(),
            st.it.toString(),
            st.sp.toString(),
            colorName(status.color(tokenId)),
            weaponName(status.weapon(tokenId))
        ];

        return _buildAttributes(trait_types, values);
    }

    function colorName(uint8 color) public pure returns(string memory){
        if(color == 1){
            return "red";
    
        }else if(color == 2){
            return "green";

        }else if(color == 3){
            return "yellow";

        }else if(color == 4){
            return "blue";

        }else if(color == 5){
            return "white";

        }else if(color == 6){
            return "black";
        } 
        return "";      
    }

    function weaponName(uint8 weapon) public pure returns(string memory){
        if(weapon == 1){ // axe
            return "axe";
    
        }else if(weapon == 2){ // glove
            return "glove";

        }else if(weapon == 3){// sword
            return "sword";

        }else if(weapon == 4){// katana
            return "katana";

        }else if(weapon == 5){// blade
            return "blade";

        }else if(weapon == 6){// lance
            return "lance";

        }else if(weapon == 7){// wand
            return "wand";
    
        }else if(weapon == 8){// rod
            return "rod";

        }else if(weapon == 9){// dagger
            return "dagger";

        }else if(weapon == 10){// shuriken
            return "shuriken";
        }
        return "";
    }

    function _buildAttributes(
        string[7] memory trait_types,
        string[7] memory values
    ) private view returns (string memory) {
        require(trait_types.length == values.length, "length must be same");

        string memory ret = "[";
        for (uint8 i = 0; i < values.length; i++) {
            ret = string(
                abi.encodePacked(
                    ret,
                    '{"trait_type": "',
                    trait_types[i],
                    '","value": "',
                    values[i],
                    '"}'
                )
            );
        }

        ret = string(abi.encodePacked(ret, "]"));
        return ret;
    }

    function generateImage(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        IStatus status = IStatus(
            registry.getRegistry("FROStatus")
        );

        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 320 320">',
                    "<style>.s{width:10px;height:10px;}",
                    _getColorStyle(status.color(tokenId)),
                    "</style>",
                    // _basePixel1(),
                    // _basePixel2(),
                    // _basePixel3(),
                    _pixelSvg(),
                    // _weaponPixel(tokenId),
                    _weaponSvg(status.weapon(tokenId)),
                    "</svg>"
                )
            );
    }

    function _concatSvgByPixel(string memory str, ITokenDescriptor.Pixel memory pixel) private view returns(string memory){        
        return string(
            abi.encodePacked(
                str, 
                '<rect x="',
                positions[pixel.x],
                '" y="',
                positions[pixel.y],
                '" class="s" fill="#',
                pixel.rgb,
                '"/>'
            )
        );
    }

    function _basePixel1() private pure returns(string memory){
        return '<rect x="150" y="30" class="s" fill="#000"/><rect x="160" y="30" class="s" fill="#000"/><rect x="170" y="30" class="s" fill="#000"/><rect x="180" y="30" class="s" fill="#000"/><rect x="190" y="30" class="s" fill="#000"/><rect x="200" y="30" class="s" fill="#000"/><rect x="210" y="30" class="s" fill="#000"/><rect x="140" y="40" class="s" fill="#000"/><rect x="150" y="40" class="s" fill="#a43"/><rect x="160" y="40" class="s" fill="#621"/><rect x="170" y="40" class="s" fill="#621"/><rect x="180" y="40" class="s" fill="#a43"/><rect x="190" y="40" class="s" fill="#C84"/><rect x="200" y="40" class="s" fill="#a43"/><rect x="210" y="40" class="s" fill="#621"/><rect x="220" y="40" class="s" fill="#000"/><rect x="230" y="40" class="s" fill="#000"/><rect x="240" y="40" class="s" fill="#000"/><rect x="130" y="50" class="s" fill="#000"/><rect x="140" y="50" class="s" fill="#000"/><rect x="150" y="50" class="s" fill="#C84"/><rect x="160" y="50" class="s" fill="#621"/><rect x="170" y="50" class="s" fill="#621"/><rect x="180" y="50" class="s" fill="#000"/><rect x="190" y="50" class="s" fill="#a43"/><rect x="200" y="50" class="s" fill="#C84"/><rect x="210" y="50" class="s" fill="#C84"/><rect x="220" y="50" class="s" fill="#a43"/><rect x="230" y="50" class="s" fill="#a43"/><rect x="240" y="50" class="s" fill="#621"/><rect x="250" y="50" class="s" fill="#000"/><rect x="130" y="60" class="s" fill="#000"/><rect x="140" y="60" class="s" fill="#654"/><rect x="150" y="60" class="s" fill="#621"/><rect x="160" y="60" class="s" fill="#000"/><rect x="170" y="60" class="s" fill="#C84"/><rect x="180" y="60" class="s" fill="#a43"/><rect x="190" y="60" class="s" fill="#000"/><rect x="200" y="60" class="s" fill="#a43"/><rect x="210" y="60" class="s" fill="#621"/><rect x="220" y="60" class="s" fill="#621"/><rect x="230" y="60" class="s" fill="#621"/><rect x="240" y="60" class="s" fill="#a43"/><rect x="250" y="60" class="s" fill="#621"/><rect x="260" y="60" class="s" fill="#000"/><rect x="120" y="70" class="s" fill="#000"/><rect x="130" y="70" class="s" fill="#a43"/><rect x="140" y="70" class="s" fill="#654"/><rect x="150" y="70" class="s" fill="#000"/><rect x="160" y="70" class="s" fill="#000"/><rect x="170" y="70" class="s" fill="#a43"/><rect x="180" y="70" class="s" fill="#C84"/><rect x="190" y="70" class="s" fill="#000"/><rect x="200" y="70" class="s" fill="#621"/><rect x="210" y="70" class="s" fill="#a43"/><rect x="220" y="70" class="s" fill="#621"/><rect x="230" y="70" class="s" fill="#521"/><rect x="240" y="70" class="s" fill="#000"/><rect x="250" y="70" class="s" fill="#621"/><rect x="260" y="70" class="s" fill="#621"/><rect x="270" y="70" class="s" fill="#000"/><rect x="120" y="80" class="s" fill="#000"/><rect x="130" y="80" class="s" fill="#a43"/><rect x="140" y="80" class="s" fill="#654"/><rect x="150" y="80" class="s" fill="#000"/><rect x="160" y="80" class="s" fill="#000"/><rect x="170" y="80" class="s" fill="#a43"/><rect x="180" y="80" class="s" fill="#C84"/><rect x="190" y="80" class="s" fill="#000"/><rect x="200" y="80" class="s" fill="#621"/><rect x="210" y="80" class="s" fill="#a43"/><rect x="220" y="80" class="s" fill="#621"/><rect x="230" y="80" class="s" fill="#521"/><rect x="240" y="80" class="s" fill="#000"/><rect x="250" y="80" class="s" fill="#000"/><rect x="260" y="80" class="s" fill="#621"/><rect x="270" y="80" class="s" fill="#000"/><rect x="120" y="90" class="s" fill="#000"/><rect x="130" y="90" class="s" fill="#621"/><rect x="140" y="90" class="s" fill="#521"/><rect x="150" y="90" class="s" fill="#000"/><rect x="160" y="90" class="s" fill="#FC8"/><rect x="170" y="90" class="s" fill="#000"/><rect x="180" y="90" class="s" fill="#a43"/><rect x="190" y="90" class="s" fill="#a43"/><rect x="200" y="90" class="s" fill="#621"/><rect x="210" y="90" class="s" fill="#a43"/><rect x="220" y="90" class="s" fill="#621"/><rect x="230" y="90" class="s" fill="#521"/><rect x="240" y="90" class="s" fill="#621"/><rect x="250" y="90" class="s" fill="#a43"/><rect x="260" y="90" class="s" fill="#621"/><rect x="270" y="90" class="s" fill="#000"/><rect x="130" y="100" class="s" fill="#000"/><rect x="140" y="100" class="s" fill="#521"/><rect x="150" y="100" class="s" fill="#000"/><rect x="160" y="100" class="s" fill="#FC8"/><rect x="170" y="100" class="s" fill="#000"/><rect x="180" y="100" class="s" fill="#000"/><rect x="190" y="100" class="s" fill="#000"/><rect x="200" y="100" class="s" fill="#621"/><rect x="210" y="100" class="s" fill="#621"/><rect x="220" y="100" class="s" fill="#a43"/><rect x="230" y="100" class="s" fill="#621"/><rect x="240" y="100" class="s" fill="#521"/><rect x="250" y="100" class="s" fill="#621"/><rect x="260" y="100" class="s" fill="#000"/><rect x="140" y="110" class="s" fill="#000"/><rect x="150" y="110" class="s" fill="#000"/><rect x="160" y="110" class="s" fill="#FC8"/><rect x="180" y="110" class="s" fill="#FFF"/><rect x="190" y="110" class="s" fill="#000"/><rect x="200" y="110" class="s" fill="#621"/><rect x="210" y="110" class="s" fill="#000"/><rect x="220" y="110" class="s" fill="#a43"/><rect x="230" y="110" class="s" fill="#621"/><rect x="240" y="110" class="s" fill="#521"/><rect x="250" y="110" class="s" fill="#000"/><rect x="260" y="110" class="s" fill="#000"/><rect x="150" y="120" class="s" fill="#000"/><rect x="160" y="120" class="s" fill="#FC8"/><rect x="180" y="120" class="s" fill="#FFF"/><rect x="190" y="120" class="s" fill="#F93"/><rect x="200" y="120" class="s" fill="#000"/><rect x="210" y="120" class="s" fill="#DA6"/><rect x="220" y="120" class="s" fill="#000"/><rect x="230" y="120" class="s" fill="#a43"/><rect x="240" y="120" class="s" fill="#000"/><rect x="250" y="120" class="s" fill="#000"/><rect x="150" y="130" class="s" fill="#000"/><rect x="160" y="130" class="s" fill="#FC8"/><rect x="170" y="130" class="s" fill="#FC8"/><rect x="180" y="130" class="s" fill="#F93"/><rect x="190" y="130" class="s" fill="#F93"/><rect x="200" y="130" class="s" fill="#DA6"/><rect x="210" y="130" class="s" fill="#DA6"/><rect x="220" y="130" class="s" fill="#000"/><rect x="230" y="130" class="s" fill="#621"/><rect x="240" y="130" class="s" fill="#000"/><rect x="150" y="140" class="s" fill="#000"/><rect x="160" y="140" class="s" fill="#000"/><rect x="170" y="140" class="s" fill="#FC8"/><rect x="180" y="140" class="s" fill="#F93"/><rect x="190" y="140" class="s" fill="#000"/><rect x="200" y="140" class="s" fill="#000"/><rect x="210" y="140" class="s" fill="#000"/><rect x="220" y="140" class="s" fill="#000"/><rect x="230" y="140" class="s" fill="#000"/><rect x="250" y="140" class="s" fill="#000"/><rect x="260" y="140" class="s" fill="#000"/><rect x="150" y="150" class="s" fill="#000"/><rect x="170" y="150" class="s" fill="#000"/><rect x="180" y="150" class="s" fill="#000"/><rect x="190" y="150" class="s" fill="#000"/><rect x="200" y="150" class="s" fill="#FC8"/><rect x="210" y="150" class="s" fill="#FC8"/><rect x="220" y="150" class="s" fill="#F93"/><rect x="230" y="150" class="s" fill="#F93"/><rect x="240" y="150" class="s" fill="#000"/><rect x="250" y="150" class="s" fill="#000"/><rect x="260" y="150" class="s" fill="#DA6"/><rect x="270" y="150" class="s" fill="#000"/><rect x="130" y="160" class="s" fill="#F93"/><rect x="140" y="160" class="s" fill="#521"/><rect x="150" y="160" class="s" fill="#000"/><rect x="170" y="160" class="s" fill="#000"/><rect x="190" y="160" class="s" fill="#000"/><rect x="200" y="160" class="s" fill="#ECA"/><rect x="210" y="160" class="s" fill="#DA6"/><rect x="220" y="160" class="s" fill="#DA6"/><rect x="230" y="160" class="s" fill="#DA6"/><rect x="240" y="160" class="s" fill="#854"/><rect x="250" y="160" class="s" fill="#FFF"/><rect x="260" y="160" class="s" fill="#CB8"/><rect x="270" y="160" class="s" fill="#000"/><rect x="120" y="170" class="s" fill="#DA6"/><rect x="130" y="170" class="s" fill="#854"/><rect x="140" y="170" class="s" fill="#521"/><rect x="150" y="170" class="s" fill="#000"/><rect x="170" y="170" class="s" fill="#000"/><rect x="190" y="170" class="s" fill="#000"/><rect x="200" y="170" class="s" fill="#ECA"/><rect x="210" y="170" class="s" fill="#CB8"/><rect x="220" y="170" class="s" fill="#CB8"/><rect x="230" y="170" class="s" fill="#CB8"/><rect x="240" y="170" class="s" fill="#854"/><rect x="250" y="170" class="s" fill="#FFF"/><rect x="260" y="170" class="s" fill="#CB8"/><rect x="270" y="170" class="s" fill="#000"/><rect x="120" y="180" class="s" fill="#000"/><rect x="130" y="180" class="s" fill="#DA6"/><rect x="140" y="180" class="s" fill="#CB8"/><rect x="150" y="180" class="s" fill="#000"/><rect x="190" y="180" class="s" fill="#000"/><rect x="200" y="180" class="s" fill="#F93"/><rect x="210" y="180" class="s" fill="#F93"/><rect x="220" y="180" class="s" fill="#621"/><rect x="230" y="180" class="s" fill="#621"/><rect x="240" y="180" class="s" fill="#621"/><rect x="250" y="180" class="s" fill="#FFF"/>';
    }

    function _basePixel2() private pure returns(string memory){
        return '<rect x="260" y="180" class="s" fill="#DA6"/><rect x="270" y="180" class="s" fill="#000"/><rect x="130" y="190" class="s" fill="#000"/><rect x="140" y="190" class="s" fill="#000"/><rect x="150" y="190" class="s" fill="#000"/><rect x="160" y="190" class="s" fill="#000"/><rect x="200" y="190" class="s" fill="#000"/><rect x="210" y="190" class="s" fill="#000"/><rect x="220" y="190" class="s" fill="#000"/><rect x="230" y="190" class="s" fill="#000"/><rect x="240" y="190" class="s" fill="#DA6"/><rect x="250" y="190" class="s" fill="#DA6"/><rect x="260" y="190" class="s" fill="#000"/><rect x="160" y="200" class="s" fill="#000"/><rect x="240" y="200" class="s" fill="#000"/><rect x="250" y="200" class="s" fill="#000"/><rect x="150" y="210" class="s" fill="#000"/><rect x="250" y="210" class="s" fill="#000"/><rect x="150" y="220" class="s" fill="#000"/><rect x="160" y="220" class="s" fill="#FFF"/><rect x="170" y="220" class="s" fill="#DA6"/><rect x="250" y="220" class="s" fill="#000"/><rect x="130" y="230" class="s" fill="#000"/><rect x="140" y="230" class="s" fill="#000"/><rect x="180" y="230" class="s" fill="#000"/><rect x="190" y="230" class="s" fill="#000"/><rect x="200" y="230" class="s" fill="#000"/><rect x="210" y="230" class="s" fill="#DA6"/><rect x="240" y="230" class="s" fill="#DA6"/><rect x="250" y="230" class="s" fill="#CB8"/><rect x="260" y="230" class="s" fill="#000"/><rect x="130" y="240" class="s" fill="#000"/><rect x="140" y="240" class="s" fill="#000"/><rect x="150" y="240" class="s" fill="#000"/><rect x="160" y="240" class="s" fill="#000"/><rect x="180" y="240" class="s" fill="#000"/><rect x="190" y="240" class="s" fill="#000"/><rect x="210" y="240" class="s" fill="#000"/><rect x="220" y="240" class="s" fill="#DA6"/><rect x="230" y="240" class="s" fill="#CB8"/><rect x="240" y="240" class="s" fill="#FFF"/><rect x="250" y="240" class="s" fill="#DA6"/><rect x="260" y="240" class="s" fill="#000"/><rect x="120" y="250" class="s" fill="#000"/><rect x="170" y="250" class="s" fill="#000"/><rect x="190" y="250" class="s" fill="#000"/><rect x="200" y="250" class="s" fill="#000"/><rect x="210" y="250" class="s" fill="#000"/><rect x="270" y="250" class="s" fill="#000"/><rect x="120" y="260" class="s" fill="#000"/><rect x="170" y="260" class="s" fill="#000"/><rect x="190" y="260" class="s" fill="#000"/><rect x="200" y="260" class="s" fill="#000"/><rect x="210" y="260" class="s" fill="#000"/><rect x="270" y="260" class="s" fill="#000"/><rect x="120" y="270" class="s" fill="#000"/><rect x="130" y="270" class="s" fill="#000"/><rect x="140" y="270" class="s" fill="#000"/><rect x="150" y="270" class="s" fill="#000"/><rect x="160" y="270" class="s" fill="#000"/><rect x="170" y="270" class="s" fill="#000"/><rect x="180" y="270" class="s" fill="#000"/><rect x="190" y="270" class="s" fill="#000"/><rect x="200" y="270" class="s" fill="#000"/><rect x="210" y="270" class="s" fill="#000"/><rect x="220" y="270" class="s" fill="#000"/><rect x="230" y="270" class="s" fill="#000"/><rect x="250" y="270" class="s" fill="#000"/><rect x="260" y="270" class="s" fill="#000"/><rect x="270" y="270" class="s" fill="#000"/><rect x="190" y="280" class="s" fill="#000"/><rect x="200" y="280" class="s" fill="#000"/><rect x="210" y="280" class="s" fill="#000"/><rect x="280" y="280" class="s" fill="#000"/><rect x="220" y="290" class="s" fill="#000"/><rect x="230" y="290" class="s" fill="#000"/><rect x="240" y="290" class="s" fill="#000"/><rect x="250" y="290" class="s" fill="#000"/><rect x="260" y="290" class="s" fill="#000"/><rect x="270" y="290" class="s" fill="#000"/><rect x="280" y="290" class="s" fill="#000"/>';
    }

    function _basePixel3() private pure returns(string memory){
        return '<rect x="170" y="110" class="s c1"/><rect x="170" y="120" class="s c1"/><rect x="160" y="150" class="s c2"/><rect x="160" y="160" class="s c1"/><rect x="180" y="160" class="s c2"/><rect x="160" y="170" class="s c1"/><rect x="180" y="170" class="s c2"/><rect x="160" y="180" class="s c1"/><rect x="170" y="180" class="s c2"/><rect x="180" y="180" class="s c2"/><rect x="170" y="190" class="s c1"/><rect x="180" y="190" class="s c1"/><rect x="190" y="190" class="s c1"/><rect x="170" y="200" class="s c1"/><rect x="180" y="200" class="s c2"/><rect x="190" y="200" class="s c2"/><rect x="200" y="200" class="s c2"/><rect x="210" y="200" class="s c1"/><rect x="220" y="200" class="s c1"/><rect x="230" y="200" class="s c1"/><rect x="160" y="210" class="s c1"/><rect x="170" y="210" class="s c2"/><rect x="180" y="210" class="s c1"/><rect x="190" y="210" class="s c2"/><rect x="200" y="210" class="s c2"/><rect x="210" y="210" class="s c2"/><rect x="220" y="210" class="s c1"/><rect x="230" y="210" class="s c1"/><rect x="240" y="210" class="s c1"/><rect x="180" y="220" class="s c1"/><rect x="190" y="220" class="s c1"/><rect x="200" y="220" class="s c2"/><rect x="210" y="220" class="s c2"/><rect x="220" y="220" class="s c1"/><rect x="230" y="220" class="s c1"/><rect x="240" y="220" class="s c1"/><rect x="150" y="230" class="s c1"/><rect x="160" y="230" class="s c2"/><rect x="170" y="230" class="s c1"/><rect x="220" y="230" class="s c1"/><rect x="230" y="230" class="s c1"/><rect x="170" y="240" class="s c1"/><rect x="130" y="250" class="s c1"/><rect x="140" y="250" class="s c1"/><rect x="150" y="250" class="s c2"/><rect x="160" y="250" class="s c1"/><rect x="180" y="250" class="s c1"/><rect x="220" y="250" class="s c1"/><rect x="230" y="250" class="s c1"/><rect x="240" y="250" class="s c2"/><rect x="250" y="250" class="s c1"/><rect x="260" y="250" class="s c1"/><rect x="130" y="260" class="s c1"/><rect x="140" y="260" class="s c1"/><rect x="150" y="260" class="s c2"/><rect x="160" y="260" class="s c1"/><rect x="180" y="260" class="s c1"/><rect x="220" y="260" class="s c1"/><rect x="230" y="260" class="s c1"/><rect x="240" y="260" class="s c2"/><rect x="250" y="260" class="s c1"/><rect x="260" y="260" class="s c1"/><rect x="240" y="270" class="s c1"/><rect x="220" y="280" class="s c1"/><rect x="230" y="280" class="s c1"/><rect x="240" y="280" class="s c2"/><rect x="250" y="280" class="s c2"/><rect x="260" y="280" class="s c1"/><rect x="270" y="280" class="s c1"/>';
    }

    function _getColorStyle(uint tokenId) private view returns(string memory){
        uint8 color = IStatus(
            registry.getRegistry("FROStatus")
        ).color(tokenId);

        if(color == 1){
            return ".c1{fill:#911;}.c2{fill:#f78;}";

        }else if(color == 2){
            return ".c1{fill:#176;}.c2{fill:#1CA;}";

        }else if(color == 3){
            return ".c1{fill:#961;}.c2{fill:#fc2;}";

        }else if(color == 4){
            return ".c1{fill:#049;}.c2{fill:#08f;}";

        }else if(color == 5){
            return ".c1{fill:#888;}.c2{fill:#ddd;}";

        }else if(color == 6){
            return ".c1{fill:#718;}.c2{fill:#c6f;}";
        }
        return "";
    }

    function _pixelSvg() private view returns(string memory){
        string memory ret = "";

        for(uint8 y = 0; y < 32; y++){
            for(uint8 x = 0; x < 32; x++){
                string memory rgb = weaponPixels[x][y];
                if(bytes(rgb).length > 0){
                    ret = _concatSvgByPixel(ret, ITokenDescriptor.Pixel(x,y,rgb));
                }
            }
        }

        return ret;
    }

    function _weaponSvg(uint tokenId) private view returns(string memory){
        uint8 weapon = IStatus(
            registry.getRegistry("FROStatus")
        ).weapon(tokenId);

        if(weapon == 1){ // axe
            return '<style>.w1{fill:#333;}.w2{fill:#999;}.w3{fill:#000;}</style><rect x="20" y="60" class="s w2"/><rect x="30" y="60" class="s w2"/><rect x="50" y="60" class="s w2"/><rect x="60" y="60" class="s w2"/><rect x="70" y="60" class="s w2"/><rect x="80" y="60" class="s w2"/><rect x="20" y="70" class="s w2"/><rect x="30" y="70" class="s w1"/><rect x="40" y="70" class="s w1"/><rect x="50" y="70" class="s w1"/><rect x="60" y="70" class="s w1"/><rect x="70" y="70" class="s w1"/><rect x="80" y="70" class="s w1"/><rect x="90" y="70" class="s w2"/><rect x="30" y="80" class="s w1"/><rect x="40" y="80" class="s w1"/><rect x="50" y="80" class="s w1"/><rect x="60" y="80" class="s w1"/><rect x="70" y="80" class="s w1"/><rect x="80" y="80" class="s w1"/><rect x="90" y="80" class="s w2"/><rect x="20" y="90" class="s w2"/><rect x="30" y="90" class="s w1"/><rect x="40" y="90" class="s w1"/><rect x="50" y="90" class="s w1"/><rect x="60" y="90" class="s w1"/><rect x="80" y="90" class="s w1"/><rect x="90" y="90" class="s w2"/><rect x="20" y="100" class="s w2"/><rect x="30" y="100" class="s w1"/><rect x="40" y="100" class="s w1"/><rect x="50" y="100" class="s w1"/><rect x="60" y="100" class="s w1"/><rect x="70" y="100" class="s w1"/><rect x="90" y="100" class="s w2"/><rect x="20" y="110" class="s w2"/><rect x="30" y="110" class="s w1"/><rect x="40" y="110" class="s w1"/><rect x="60" y="110" class="s w1"/><rect x="70" y="110" class="s w1"/><rect x="80" y="110" class="s w1"/><rect x="20" y="120" class="s w2"/><rect x="30" y="120" class="s w1"/><rect x="40" y="120" class="s w1"/><rect x="50" y="120" class="s w1"/><rect x="70" y="120" class="s w1"/><rect x="80" y="120" class="s w1"/><rect x="90" y="120" class="s w1"/><rect x="30" y="130" class="s w2"/><rect x="40" y="130" class="s w2"/><rect x="50" y="130" class="s w2"/><rect x="60" y="130" class="s w2"/><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w1"/><rect x="100" y="130" class="s w1"/><rect x="90" y="140" class="s w1"/><rect x="100" y="140" class="s w1"/><rect x="110" y="140" class="s w1"/><rect x="100" y="150" class="s w1"/><rect x="110" y="150" class="s w1"/><rect x="120" y="150" class="s w1"/><rect x="130" y="150" class="s w3"/><rect x="110" y="160" class="s w1"/><rect x="120" y="160" class="s w1"/><rect x="110" y="170" class="s w3"/>';

        }else if(weapon == 2){ // glove
            return '<style>.w1{fill:#000;}.w2{fill:#43A;}.w3{fill:#53C;}</style><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w1"/><rect x="100" y="130" class="s w1"/><rect x="110" y="130" class="s w1"/><rect x="70" y="140" class="s w1"/><rect x="80" y="140" class="s w2"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w2"/><rect x="110" y="140" class="s w2"/><rect x="120" y="140" class="s w1"/><rect x="130" y="140" class="s w1"/><rect x="70" y="150" class="s w1"/><rect x="80" y="150" class="s w2"/><rect x="90" y="150" class="s w2"/><rect x="100" y="150" class="s w2"/><rect x="110" y="150" class="s w2"/><rect x="120" y="150" class="s w2"/><rect x="130" y="150" class="s w2"/><rect x="140" y="150" class="s w1"/><rect x="70" y="160" class="s w1"/><rect x="80" y="160" class="s w2"/><rect x="90" y="160" class="s w2"/><rect x="100" y="160" class="s w3"/><rect x="110" y="160" class="s w3"/><rect x="120" y="160" class="s w2"/><rect x="130" y="160" class="s w2"/><rect x="140" y="160" class="s w2"/><rect x="70" y="170" class="s w1"/><rect x="80" y="170" class="s w2"/><rect x="90" y="170" class="s w2"/><rect x="100" y="170" class="s w3"/><rect x="110" y="170" class="s w2"/><rect x="120" y="170" class="s w2"/><rect x="130" y="170" class="s w2"/><rect x="140" y="170" class="s w2"/><rect x="70" y="180" class="s w1"/><rect x="80" y="180" class="s w2"/><rect x="90" y="180" class="s w2"/><rect x="100" y="180" class="s w2"/><rect x="110" y="180" class="s w2"/><rect x="120" y="180" class="s w2"/><rect x="130" y="180" class="s w2"/><rect x="140" y="180" class="s w2"/><rect x="70" y="190" class="s w1"/><rect x="80" y="190" class="s w1"/><rect x="90" y="190" class="s w2"/><rect x="100" y="190" class="s w2"/><rect x="110" y="190" class="s w2"/><rect x="120" y="190" class="s w2"/><rect x="130" y="190" class="s w1"/><rect x="140" y="190" class="s w1"/><rect x="90" y="200" class="s w1"/><rect x="100" y="200" class="s w1"/><rect x="110" y="200" class="s w1"/><rect x="120" y="200" class="s w1"/>';

        }else if(weapon == 3){// sword
            return '<style>.w1{fill:#000;}.w2{fill:#36C;}</style><rect x="20" y="60" class="s w1"/><rect x="30" y="60" class="s w1"/><rect x="40" y="60" class="s w1"/><rect x="20" y="70" class="s w1"/><rect x="30" y="70" class="s w2"/><rect x="40" y="70" class="s w1"/><rect x="50" y="70" class="s w1"/><rect x="20" y="80" class="s w1"/><rect x="30" y="80" class="s w1"/><rect x="40" y="80" class="s w2"/><rect x="50" y="80" class="s w1"/><rect x="60" y="80" class="s w1"/><rect x="30" y="90" class="s w1"/><rect x="40" y="90" class="s w1"/><rect x="50" y="90" class="s w2"/><rect x="60" y="90" class="s w1"/><rect x="70" y="90" class="s w1"/><rect x="40" y="100" class="s w1"/><rect x="50" y="100" class="s w1"/><rect x="60" y="100" class="s w2"/><rect x="70" y="100" class="s w1"/><rect x="80" y="100" class="s w1"/><rect x="50" y="110" class="s w1"/><rect x="60" y="110" class="s w1"/><rect x="70" y="110" class="s w2"/><rect x="80" y="110" class="s w1"/><rect x="90" y="110" class="s w1"/><rect x="60" y="120" class="s w1"/><rect x="70" y="120" class="s w1"/><rect x="80" y="120" class="s w2"/><rect x="90" y="120" class="s w1"/><rect x="100" y="120" class="s w1"/><rect x="70" y="130" class="s w1"/><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w2"/><rect x="100" y="130" class="s w1"/><rect x="110" y="130" class="s w1"/><rect x="130" y="130" class="s w1"/><rect x="140" y="130" class="s w1"/><rect x="80" y="140" class="s w1"/><rect x="90" y="140" class="s w1"/><rect x="100" y="140" class="s w2"/><rect x="110" y="140" class="s w1"/><rect x="120" y="140" class="s w1"/><rect x="130" y="140" class="s w2"/><rect x="140" y="140" class="s w1"/><rect x="90" y="150" class="s w1"/><rect x="100" y="150" class="s w1"/><rect x="110" y="150" class="s w2"/><rect x="120" y="150" class="s w2"/><rect x="130" y="150" class="s w1"/><rect x="100" y="160" class="s w1"/><rect x="110" y="160" class="s w2"/><rect x="120" y="160" class="s w1"/><rect x="90" y="170" class="s w1"/><rect x="100" y="170" class="s w2"/><rect x="110" y="170" class="s w1"/><rect x="90" y="180" class="s w1"/><rect x="100" y="180" class="s w1"/>';

        }else if(weapon == 4){// katana
            return '<style>.w1{fill:#000;}.w2{fill:#BCC;}.w3{fill:#677;}</style><rect x="20" y="50" class="s w2"/><rect x="20" y="60" class="s w2"/><rect x="30" y="60" class="s w3"/><rect x="20" y="70" class="s w2"/><rect x="30" y="70" class="s w3"/><rect x="40" y="70" class="s w3"/><rect x="30" y="80" class="s w2"/><rect x="40" y="80" class="s w3"/><rect x="50" y="80" class="s w3"/><rect x="40" y="90" class="s w2"/><rect x="50" y="90" class="s w3"/><rect x="60" y="90" class="s w3"/><rect x="50" y="100" class="s w2"/><rect x="60" y="100" class="s w3"/><rect x="70" y="100" class="s w3"/><rect x="60" y="110" class="s w2"/><rect x="70" y="110" class="s w3"/><rect x="80" y="110" class="s w3"/><rect x="70" y="120" class="s w2"/><rect x="80" y="120" class="s w3"/><rect x="90" y="120" class="s w3"/><rect x="80" y="130" class="s w2"/><rect x="90" y="130" class="s w3"/><rect x="100" y="130" class="s w3"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w3"/><rect x="110" y="140" class="s w3"/><rect x="130" y="140" class="s w1"/><rect x="100" y="150" class="s w2"/><rect x="110" y="150" class="s w3"/><rect x="120" y="150" class="s w3"/><rect x="130" y="150" class="s w1"/><rect x="110" y="160" class="s w2"/><rect x="120" y="160" class="s w1"/><rect x="100" y="170" class="s w1"/><rect x="110" y="170" class="s w1"/>';

        }else if(weapon == 5){// blade
            return '<style>.w1{fill:#000;}.w2{fill:#812;}</style><rect x="20" y="60" class="s w1"/><rect x="30" y="60" class="s w1"/><rect x="40" y="60" class="s w1"/><rect x="20" y="70" class="s w1"/><rect x="30" y="70" class="s w2"/><rect x="40" y="70" class="s w2"/><rect x="50" y="70" class="s w1"/><rect x="20" y="80" class="s w1"/><rect x="30" y="80" class="s w2"/><rect x="40" y="80" class="s w1"/><rect x="50" y="80" class="s w2"/><rect x="60" y="80" class="s w1"/><rect x="30" y="90" class="s w1"/><rect x="40" y="90" class="s w2"/><rect x="50" y="90" class="s w1"/><rect x="60" y="90" class="s w2"/><rect x="70" y="90" class="s w1"/><rect x="40" y="100" class="s w1"/><rect x="50" y="100" class="s w2"/><rect x="60" y="100" class="s w1"/><rect x="70" y="100" class="s w2"/><rect x="80" y="100" class="s w1"/><rect x="50" y="110" class="s w1"/><rect x="60" y="110" class="s w2"/><rect x="70" y="110" class="s w1"/><rect x="80" y="110" class="s w2"/><rect x="90" y="110" class="s w1"/><rect x="60" y="120" class="s w1"/><rect x="70" y="120" class="s w2"/><rect x="80" y="120" class="s w1"/><rect x="90" y="120" class="s w2"/><rect x="100" y="120" class="s w1"/><rect x="70" y="130" class="s w1"/><rect x="80" y="130" class="s w2"/><rect x="90" y="130" class="s w1"/><rect x="100" y="130" class="s w2"/><rect x="110" y="130" class="s w1"/><rect x="130" y="130" class="s w1"/><rect x="140" y="130" class="s w1"/><rect x="80" y="140" class="s w1"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w1"/><rect x="110" y="140" class="s w2"/><rect x="120" y="140" class="s w1"/><rect x="130" y="140" class="s w2"/><rect x="140" y="140" class="s w1"/><rect x="90" y="150" class="s w1"/><rect x="100" y="150" class="s w2"/><rect x="110" y="150" class="s w1"/><rect x="120" y="150" class="s w2"/><rect x="130" y="150" class="s w1"/><rect x="100" y="160" class="s w1"/><rect x="110" y="160" class="s w2"/><rect x="120" y="160" class="s w1"/><rect x="90" y="170" class="s w1"/><rect x="100" y="170" class="s w2"/><rect x="110" y="170" class="s w1"/><rect x="90" y="180" class="s w1"/><rect x="100" y="180" class="s w1"/>';

        }else if(weapon == 6){// lance
            return '<style>.w1{fill:#034;}.w2{fill:#000;}.w3{fill:#C22;}</style><rect x="10" y="50" class="s w1"/><rect x="20" y="50" class="s w1"/><rect x="40" y="50" class="s w1"/><rect x="50" y="50" class="s w1"/><rect x="10" y="60" class="s w1"/><rect x="20" y="60" class="s w1"/><rect x="30" y="60" class="s w1"/><rect x="50" y="60" class="s w1"/><rect x="60" y="60" class="s w1"/><rect x="20" y="70" class="s w1"/><rect x="30" y="70" class="s w1"/><rect x="40" y="70" class="s w1"/><rect x="60" y="70" class="s w1"/><rect x="70" y="70" class="s w1"/><rect x="10" y="80" class="s w1"/><rect x="30" y="80" class="s w1"/><rect x="40" y="80" class="s w1"/><rect x="50" y="80" class="s w1"/><rect x="60" y="80" class="s w1"/><rect x="10" y="90" class="s w1"/><rect x="20" y="90" class="s w1"/><rect x="40" y="90" class="s w1"/><rect x="50" y="90" class="s w3"/><rect x="60" y="90" class="s w1"/><rect x="20" y="100" class="s w1"/><rect x="30" y="100" class="s w1"/><rect x="40" y="100" class="s w1"/><rect x="50" y="100" class="s w1"/><rect x="60" y="100" class="s w1"/><rect x="70" y="100" class="s w1"/><rect x="30" y="110" class="s w1"/><rect x="60" y="110" class="s w1"/><rect x="70" y="110" class="s w1"/><rect x="80" y="110" class="s w1"/><rect x="70" y="120" class="s w1"/><rect x="80" y="120" class="s w1"/><rect x="90" y="120" class="s w1"/><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w1"/><rect x="100" y="130" class="s w1"/><rect x="90" y="140" class="s w1"/><rect x="100" y="140" class="s w1"/><rect x="110" y="140" class="s w1"/><rect x="100" y="150" class="s w1"/><rect x="110" y="150" class="s w1"/><rect x="120" y="150" class="s w1"/><rect x="130" y="150" class="s w2"/><rect x="140" y="150" class="s w2"/><rect x="110" y="160" class="s w1"/><rect x="120" y="160" class="s w2"/><rect x="110" y="170" class="s w2"/>';

        }else if(weapon == 7){// wand
            return '<style>.w1{fill:#520;}.w2{fill:#C2E}</style><rect x="10" y="80" class="s w1"/><rect x="20" y="80" class="s w1"/><rect x="30" y="80" class="s w1"/><rect x="40" y="80" class="s w1"/><rect x="50" y="80" class="s w1"/><rect x="60" y="80" class="s w1"/><rect x="10" y="90" class="s w1"/><rect x="60" y="90" class="s w1"/><rect x="10" y="100" class="s w1"/><rect x="30" y="100" class="s w2"/><rect x="40" y="100" class="s w1"/><rect x="60" y="100" class="s w1"/><rect x="10" y="110" class="s w1"/><rect x="40" y="110" class="s w1"/><rect x="60" y="110" class="s w1"/><rect x="70" y="110" class="s w1"/><rect x="10" y="120" class="s w1"/><rect x="20" y="120" class="s w1"/><rect x="30" y="120" class="s w1"/><rect x="40" y="120" class="s w1"/><rect x="70" y="120" class="s w1"/><rect x="80" y="120" class="s w1"/><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w1"/><rect x="90" y="140" class="s w1"/><rect x="100" y="140" class="s w1"/><rect x="100" y="150" class="s w1"/><rect x="110" y="150" class="s w1"/><rect x="130" y="150" class="s" fill="#000"/><rect x="140" y="150" class="s" fill="#000"/><rect x="110" y="160" class="s w1"/><rect x="120" y="160" class="s" fill="#000"/><rect x="110" y="170" class="s" fill="#000"/>';
    
        }else if(weapon == 8){// rod
            return '<style>.w1{fill:#C22;}.w2{fill:#114;}.w3{fill:#000;}</style><rect x="20" y="60" class="s w1"/><rect x="30" y="60" class="s w1"/><rect x="40" y="60" class="s w1"/><rect x="50" y="60" class="s w1"/><rect x="20" y="70" class="s w1"/><rect x="30" y="70" class="s w1"/><rect x="40" y="70" class="s w1"/><rect x="50" y="70" class="s w1"/><rect x="20" y="80" class="s w1"/><rect x="30" y="80" class="s w1"/><rect x="40" y="80" class="s w2"/><rect x="50" y="80" class="s w2"/><rect x="20" y="90" class="s w1"/><rect x="30" y="90" class="s w1"/><rect x="40" y="90" class="s w2"/><rect x="50" y="90" class="s w2"/><rect x="60" y="90" class="s w2"/><rect x="50" y="100" class="s w2"/><rect x="60" y="100" class="s w2"/><rect x="70" y="100" class="s w2"/><rect x="60" y="110" class="s w2"/><rect x="70" y="110" class="s w2"/><rect x="80" y="110" class="s w2"/><rect x="70" y="120" class="s w2"/><rect x="80" y="120" class="s w2"/><rect x="90" y="120" class="s w2"/><rect x="80" y="130" class="s w2"/><rect x="90" y="130" class="s w2"/><rect x="100" y="130" class="s w2"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w2"/><rect x="110" y="140" class="s w2"/><rect x="100" y="150" class="s w2"/><rect x="110" y="150" class="s w2"/><rect x="120" y="150" class="s w2"/><rect x="130" y="150" class="s w3"/><rect x="140" y="150" class="s w3"/><rect x="110" y="160" class="s w2"/><rect x="120" y="160" class="s w3"/><rect x="110" y="170" class="s w3"/>';

        }else if(weapon == 9){// dagger
            return '<style>.w1{fill:#000;}.w2{fill:#E72;}</style><rect x="50" y="90" class="s w1"/><rect x="60" y="90" class="s w1"/><rect x="70" y="90" class="s w1"/><rect x="50" y="100" class="s w1"/><rect x="60" y="100" class="s w2"/><rect x="70" y="100" class="s w2"/><rect x="80" y="100" class="s w1"/><rect x="50" y="110" class="s w1"/><rect x="60" y="110" class="s w2"/><rect x="70" y="110" class="s w2"/><rect x="80" y="110" class="s w2"/><rect x="90" y="110" class="s w1"/><rect x="60" y="120" class="s w1"/><rect x="70" y="120" class="s w2"/><rect x="80" y="120" class="s w2"/><rect x="90" y="120" class="s w2"/><rect x="100" y="120" class="s w1"/><rect x="70" y="130" class="s w1"/><rect x="80" y="130" class="s w2"/><rect x="90" y="130" class="s w2"/><rect x="100" y="130" class="s w2"/><rect x="110" y="130" class="s w1"/><rect x="80" y="140" class="s w1"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w2"/><rect x="110" y="140" class="s w2"/><rect x="120" y="140" class="s w1"/><rect x="90" y="150" class="s w1"/><rect x="100" y="150" class="s w2"/><rect x="110" y="150" class="s w2"/><rect x="120" y="150" class="s w2"/><rect x="130" y="150" class="s w1"/><rect x="140" y="150" class="s w1"/><rect x="100" y="160" class="s w1"/><rect x="110" y="160" class="s w2"/><rect x="120" y="160" class="s w1"/><rect x="110" y="170" class="s w1"/>';

        }else if(weapon == 10){// shuriken
            return '<style>.w1{fill:#000;}.w2{fill:#19A;}</style><rect x="20" y="110" class="s w1"/><rect x="30" y="110" class="s w1"/><rect x="40" y="110" class="s w1"/><rect x="100" y="110" class="s w1"/><rect x="110" y="110" class="s w1"/><rect x="120" y="110" class="s w1"/><rect x="20" y="120" class="s w1"/><rect x="30" y="120" class="s w2"/><rect x="40" y="120" class="s w2"/><rect x="50" y="120" class="s w1"/><rect x="90" y="120" class="s w1"/><rect x="100" y="120" class="s w2"/><rect x="110" y="120" class="s w2"/><rect x="120" y="120" class="s w1"/><rect x="20" y="130" class="s w1"/><rect x="30" y="130" class="s w2"/><rect x="40" y="130" class="s w2"/><rect x="50" y="130" class="s w2"/><rect x="60" y="130" class="s w1"/><rect x="80" y="130" class="s w1"/><rect x="90" y="130" class="s w2"/><rect x="100" y="130" class="s w2"/><rect x="110" y="130" class="s w2"/><rect x="120" y="130" class="s w1"/><rect x="30" y="140" class="s w1"/><rect x="40" y="140" class="s w2"/><rect x="50" y="140" class="s w2"/><rect x="60" y="140" class="s w2"/><rect x="70" y="140" class="s w1"/><rect x="80" y="140" class="s w2"/><rect x="90" y="140" class="s w2"/><rect x="100" y="140" class="s w2"/><rect x="110" y="140" class="s w1"/><rect x="40" y="150" class="s w1"/><rect x="50" y="150" class="s w2"/><rect x="60" y="150" class="s w2"/><rect x="70" y="150" class="s w2"/><rect x="80" y="150" class="s w2"/><rect x="90" y="150" class="s w2"/><rect x="100" y="150" class="s w1"/><rect x="130" y="150" class="s w1"/><rect x="140" y="150" class="s w1"/><rect x="50" y="160" class="s w1"/><rect x="60" y="160" class="s w2"/><rect x="70" y="160" class="s w1"/><rect x="80" y="160" class="s w2"/><rect x="90" y="160" class="s w1"/><rect x="120" y="160" class="s w1"/><rect x="40" y="170" class="s w1"/><rect x="50" y="170" class="s w2"/><rect x="60" y="170" class="s w2"/><rect x="70" y="170" class="s w2"/><rect x="80" y="170" class="s w2"/><rect x="90" y="170" class="s w2"/><rect x="100" y="170" class="s w1"/><rect x="110" y="170" class="s w1"/><rect x="30" y="180" class="s w1"/><rect x="40" y="180" class="s w2"/><rect x="50" y="180" class="s w2"/><rect x="60" y="180" class="s w2"/><rect x="70" y="180" class="s w1"/><rect x="80" y="180" class="s w2"/><rect x="90" y="180" class="s w2"/><rect x="100" y="180" class="s w2"/><rect x="110" y="180" class="s w1"/><rect x="20" y="190" class="s w1"/><rect x="30" y="190" class="s w2"/><rect x="40" y="190" class="s w2"/><rect x="50" y="190" class="s w2"/><rect x="60" y="190" class="s w1"/><rect x="80" y="190" class="s w1"/><rect x="90" y="190" class="s w2"/><rect x="100" y="190" class="s w2"/><rect x="110" y="190" class="s w2"/><rect x="120" y="190" class="s w1"/><rect x="20" y="200" class="s w1"/><rect x="30" y="200" class="s w2"/><rect x="40" y="200" class="s w2"/><rect x="50" y="200" class="s w1"/><rect x="90" y="200" class="s w1"/><rect x="100" y="200" class="s w2"/><rect x="110" y="200" class="s w2"/><rect x="120" y="200" class="s w1"/><rect x="20" y="210" class="s w1"/><rect x="30" y="210" class="s w1"/><rect x="40" y="210" class="s w1"/><rect x="100" y="210" class="s w1"/><rect x="110" y="210" class="s w1"/><rect x="120" y="210" class="s w1"/>';
        }
        
        return "";
    }

    function tokenURI(IERC721 token, uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                generateName(tokenId),
                                '", "description":"',
                                generateDescription(tokenId),
                                '", "attributes":"',
                                generateAttributes(tokenId),
                                '", "image": "data:image/svg+xml;base64,',
                                generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
