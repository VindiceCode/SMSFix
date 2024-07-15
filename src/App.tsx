import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import ContactList from './Components/ContactList';
import AccountList from './Components/AccountList';
import MetricsDisplay from './Components/MetricsDisplay';
import OptimizationRecommendations from './Components/OptimizationRecommendations';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/contacts" component={ContactList} />
          <Route path="/accounts" component={AccountList} />
          <Route path="/metrics" component={MetricsDisplay} />
          <Route path="/recommendations" component={OptimizationRecommendations} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
