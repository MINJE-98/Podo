import { useGetGroupsList, useHasGroup } from "../../hooks/groups"
import GroupCard from "../../components/groups/GroupCard";
import CreateButton from "../../components/groups/CreateButton";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useEthers } from "@usedapp/core";
import PageTitle from "../../components/font/PageTitle";
import MainFlex from "../../components/boxs/MainFlex";
import { Skeleton, Spacer } from "@chakra-ui/react";

export default function Groups(){
const groupAddress = useGetGroupsList();
const { account } = useEthers();
const hasGroup =  false
  return(
    <MainFlex>
        <Flex
          justifyContent="center"
          alignItems="center"
        >
          <PageTitle text="Group" />
          <Spacer />
          {console.log(hasGroup)}
          { hasGroup ? <></> : <CreateButton />
          }
        </Flex>
          <Flex
            flexWrap="wrap"
            justifyContent="center"
          >
            {!groupAddress ? <></> : groupAddress.map((v: any )=> <GroupCard key={v} address={v} />)}
          </Flex>
    </MainFlex>
  )
}