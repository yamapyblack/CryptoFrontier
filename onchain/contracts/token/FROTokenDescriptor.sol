// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/ISvgWeapon.sol";
import "../interfaces/IStatus.sol";
import './FROSvgBase.sol';

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

    // string[32] positions = ["0","10","20","30","40","50","60","70","80","90","100","110","120","130","140","150","160","170","180","190","200","210","220","230","240","250","260","270","280","290","300","310"];
    string[7] attributes = ["hp", "at", "df", "it", "sp", "color", "weapon"];
    string[6] colorName = ["red","green","yellow","blue","white","black"];

    //mapping(x => mapping(y => rgb))
    // mapping(uint => mapping(uint => string)) weaponPixels;

    string _name = "CryptoFrontier Character #";
    string _description = 'CryptoFrontier is the Full On-chained Game by FrontierDAO.\\n\\nFull On-chained Game is the game where all the data of the game is stored on-chain. Not only the NFTs, but also characters status, skills, battle results and even the battle logic are recorded on-chain.\\nhttps://medium.com/@yamapyblack/full-on-chained-game-by-frontierdao-b8e50549811d';

    constructor(address registry_) FROAddressesProxy(registry_) {}

    function setName(string memory name) external onlyOwner {
        _name = name;
    }

    function setDescription(string memory description) external onlyOwner {
        _description = description;
    }

    // mapping(uint => mapping(uint => string)) basePixels;

    // function setPixels(ITokenDescriptor.Pixel[] memory _pixels) external {
    //     for(uint16 i = 0; i < _pixels.length; i++){
    //         basePixels[_pixels[i].x][_pixels[i].y] = _pixels[i].rgb;
    //     }
    // }

    // function setWeaponPixels(ITokenDescriptor.Pixel[] memory _pixels) external {
    //     for(uint16 i = 0; i < _pixels.length; i++){
    //         weaponPixels[_pixels[i].x][_pixels[i].y] = _pixels[i].rgb;
    //     }
    // }

    function _generateName(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    _name,
                    tokenId.toString()
                )
            );
    }

    function _generateDescription(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return _description;
    }

    function _generateAttributes(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        IStatus status = IStatus(
            registry.getRegistry("FROStatus")
        );

        IStatus.Status memory st = status.getStatus(tokenId);

        ISvgWeapon weapon = ISvgWeapon(
            registry.getRegistry("FROSvgWeapon")
        );

        string[7] memory values = [
            st.hp.toString(),
            st.at.toString(),
            st.df.toString(),
            st.it.toString(),
            st.sp.toString(),
            colorName[status.color(tokenId) - 1],
            weapon.weaponName(status.weapon(tokenId))
        ];

        return _buildAttributes(attributes, values);
    }

    function _buildAttributes(
        string[7] memory trait_types,
        string[7] memory values
    ) private pure returns (string memory) {
        string memory ret = "[";

        for (uint8 i = 0; i < values.length; i++) {

            if(i == 0){
                ret = string(
                    abi.encodePacked(
                        ret,
                        '{"trait_type": "',
                        trait_types[i],
                        '","value": ',
                        values[i],
                        '}'
                    )
                );
            }else if(i < 5){
                ret = string(
                    abi.encodePacked(
                        ret,
                        ',',
                        '{"trait_type": "',
                        trait_types[i],
                        '","value": ',
                        values[i],
                        '}'
                    )
                );
            }else{
                ret = string(
                    abi.encodePacked(
                        ret,
                        ',',
                        '{"trait_type": "',
                        trait_types[i],
                        '","value": "',
                        values[i],
                        '"}'
                    )
                );
            }
        }

        return string(abi.encodePacked(ret, "]"));
    }

    function _generateImage(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        IStatus status = IStatus(
            registry.getRegistry("FROStatus")
        );

        ISvgWeapon weapon = ISvgWeapon(
            registry.getRegistry("FROSvgWeapon")
        );

        return
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 320 320">',
                        "<style>.s{width:10px;height:10px;}",
                        _getColorStyle(status.color(tokenId)),
                        "</style>",
                        FROSvgBase.basePixel1(),
                        FROSvgBase.basePixel2(),
                        FROSvgBase.basePixel3(),
                        weapon.weaponSvg(status.weapon(tokenId)),
                        // _pixelSvg(),
                        // _weaponPixel(tokenId),
                        "</svg>"
                    )
                )
            );
    }

    // function _concatSvgByPixel(string memory str, ITokenDescriptor.Pixel memory pixel) private view returns(string memory){        
    //     return string(
    //         abi.encodePacked(
    //             str, 
    //             '<rect x="',
    //             positions[pixel.x],
    //             '" y="',
    //             positions[pixel.y],
    //             '" class="s" fill="#',
    //             pixel.rgb,
    //             '"/>'
    //         )
    //     );
    // }

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

    // function _pixelSvg() private view returns(string memory){
    //     string memory ret = "";

    //     for(uint8 y = 0; y < 32; y++){
    //         for(uint8 x = 0; x < 32; x++){
    //             string memory rgb = weaponPixels[x][y];
    //             if(bytes(rgb).length > 0){
    //                 ret = _concatSvgByPixel(ret, ITokenDescriptor.Pixel(x,y,rgb));
    //             }
    //         }
    //     }

    //     return ret;
    // }

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
                                _generateName(tokenId),
                                '", "description":"',
                                _generateDescription(tokenId),
                                '", "attributes":',
                                _generateAttributes(tokenId),
                                ', "image": "data:image/svg+xml;base64,',
                                _generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
