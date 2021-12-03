import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import theme from "./theme";
import Layout from "./components/Layout";
import "@fontsource/inter";
import Headers from "./containers/header/Headers";
import Home from "./containers/home/Home";
import Groups from "./containers/groups/Groups";
import Campaigns from "./containers/campaigns/Campaigns";
import Proposals from "./containers/proposals/Proposals";
import MyPage from "./containers/mypage/MyPage";
import GroupCreate from "./containers/groups/GroupCreate";
import GroupInfo from "./containers/groups/GroupInfo";
import CampaignCreate from "./containers/campaigns/CampaignCreate";
import CampaignInfo from "./containers/campaigns/CampaignInfo";
import ProposalCreate from "./containers/proposals/ProposalCreate";
import ProposalInfo from "./containers/proposals/ProposalInfo";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
      <Router>
          <Headers />
          <Switch>
            <Route exact path='/podoo' component={Home} />
            <Route path='/groups'component={Groups} />
            <Route path='/groupInfo'component={GroupInfo} />
            <Route path='/campaigns'component={Campaigns} />
            <Route path='/campaignInfo'component={CampaignInfo} />
            <Route path='/proposals'component={Proposals} />
            <Route path='/proposalInfo'component={ProposalInfo} />
            <Route path='/mypage' component={MyPage} />
            <Route path='/groupcreate' component={GroupCreate} />
            <Route path='/campaigncreate' component={CampaignCreate} />
            <Route path='/proposalcreate' component={ProposalCreate} />
            </Switch>
      </Router>
      </Layout>
        {/* <AccountModal isOpen={isOpen} onClose={onClose} />
        <Count /> */}
    </ChakraProvider>
  );
}

export default App;
