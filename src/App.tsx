import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import AccountList from './components/AccountList';
import MetricsDisplay from './components/MetricsDisplay';
import OptimizationRecommendations from './components/OptimizationRecommendations';

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
