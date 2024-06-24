// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract horoscopeNFT is ERC721URIStorage {
    uint256 private _tokenIds;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><defs><linearGradient id='backgroundGradient' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:#ff7e5f;stop-opacity:1' /><stop offset='100%' style='stop-color:#feb47b;stop-opacity:1' /></linearGradient><filter id='blur' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur in='SourceGraphic' stdDeviation='5' /></filter></defs><rect width='100%' height='100%' fill='url(#backgroundGradient)' /><circle cx='175' cy='175' r='80' fill='white' opacity='0.3' /><circle cx='175' cy='175' r='60' fill='white' filter='url(#blur)' opacity='0.5' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>Virgo</text><line x1='50' y1='300' x2='300' y2='300' stroke='white' stroke-width='2' /><circle cx='50' cy='300' r='5' fill='white' /><circle cx='300' cy='300' r='5' fill='white' /></svg>";

    constructor() ERC721("Horoscope", "HSCP") {}

    function mintNFT(address recipient, string memory zodiacSign)
        public
        returns (uint256)
    {
        _tokenIds += 1;
        

        string memory finalSvg = string(
            abi.encodePacked(baseSvg, zodiacSign, "</text></svg>")
        );

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',zodiacSign,
                        // We set the title of our NFT as the generated word.
                        '", "description": "On-chain Zodiac Sign NFTs", "attributes": [{"trait_type": "Zodiac Sign", "value": "',
                        zodiacSign,
                        '"}], "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        uint256 newItemId = _tokenIds;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        return newItemId;
    }
}
