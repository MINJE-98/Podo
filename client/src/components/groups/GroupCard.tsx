import { Link, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/react";
import { Link as reactLink } from "react-router-dom";
import { useGetGroupInfoFromAddress } from "../../hooks/groups"
import GroupLogoTest from "./GroupLogoTest";

export default function GroupCard({address}: any) {
    const groupInfo = useGetGroupInfoFromAddress(address);
    return(
        <>
        <Link
            background="white"
            borderRadius="md"
            shadow="md"
            w="255px"
            h="200px"
            minW="255px"
            my="5"
            mx="2"
            p="26px"
            key={address}
            borderColor="#875EFB"
            _hover={{
                backgroundColor: "#FFD9D9",
            }}
            _focus={{
                border: "2px",
                borderColor: "#875EFB"
            }}
            as={reactLink}
            to={`/groupInfo?address=${address}`}>
                <GroupLogoTest />
                <Text
                        mt="27px"
                        fontFamily="Poppins"
                        fontWeight="medium"
                        fontSize="xl"
                >

                    {!groupInfo ? <Skeleton h="20px" w="160px" /> : groupInfo.name}
                </Text>
                <Text
                        fontFamily="Poppins"
                        fontWeight="medium"
                        fontSize="3xs"
                        color="#5E6289"
                    >
                         {!groupInfo ? <Skeleton h="80px" w="200px" /> : groupInfo.desc.length <= 40 ? groupInfo.desc : groupInfo.desc.substring(0,41) + "..."}
                    </Text>
        </Link>
    </>
    )
}