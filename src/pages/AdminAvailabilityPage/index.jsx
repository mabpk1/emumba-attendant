import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Tabs } from 'antd';
import axios from 'axios';
import routes from '../../routes.json';

import constants from '../../constants.json';

import TableHeadings from '../../components/TableHeadings';
import SearchBox from '../../components/SearchBox';
import AppContext from '../../context/app-context';

const { TabPane } = Tabs;

const getAccessTokenFromServer = async (url, code) => {
  try {
    const req = await axios.post(url, code);
    const token = await req.data.token;
    localStorage.setItem('token', token);
    console.log('SetAdminToken:', token);
  } catch (error) {
    console.error('ERROR:', error);
  }
};

const AdminAvailabilityPage = () => {
  const { isAdminLoggedin, users } = useContext(AppContext);
  const available = users.filter((item) => (item.available === 'Available'));
  const notAvailable = users.filter((item) => (item.available === 'Not Available'));
  const onLeave = users.filter((item) => (item.available === 'On Leave'));

  const [searchField, setSearchField] = useState('');

  const filteredUser = users.filter((user) => user.id.toLowerCase()
    .includes(searchField.toLowerCase()));

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');

    if (hasCode) {
      const newUrl = url.split('?code=');
      window.history.pushState({}, null, newUrl[0]);

      const requestData = {
        code: newUrl[1],
      };

      getAccessTokenFromServer(constants.AdminProxyUrl, requestData);
    }
  }, []);

  return (

    <section className="dashboard">
      <h1>Today&apos;s Availability Page</h1>
      {isAdminLoggedin
        ? (
          <div className="dashboard-container">
            <SearchBox
              placeholder="Global Search by ID"
              setSearchField={setSearchField}
            />

            {filteredUser.length > 0 && searchField !== ''
              ? (
                filteredUser.map((user) => (
                  <div className="user-row searched-data" key={user.id}>
                    <p className="user-id">{user.id}</p>
                    <p className="user-fname">{user.firstname}</p>
                    <p className="user-lname">{user.lastname}</p>
                    <p className="user-availability-email">{user.email}</p>
                    <p className="user-dept">{user.department}</p>
                    <p className="user-role">{user.role}</p>
                  </div>
                )))
              : null}

            <div className="dashboard-group">
              <Tabs defaultActiveKey="1" centered>
                <TabPane tab="Available" key="1">
                  <TableHeadings />
                  {available.map((user) => (
                    <div className="user-row" key={user.id}>
                      <p className="user-id">{user.id}</p>
                      <p className="user-fname">{user.firstname}</p>
                      <p className="user-lname">{user.lastname}</p>
                      <p className="user-availability-email">{user.email}</p>
                      <p className="user-dept">{user.department}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                  ))}
                </TabPane>

                <TabPane tab="Not Available" key="2">
                  <TableHeadings />
                  {notAvailable.map((user) => (
                    <div className="user-row" key={user.id}>
                      <p className="user-id">{user.id}</p>
                      <p className="user-fname">{user.firstname}</p>
                      <p className="user-lname">{user.lastname}</p>
                      <p className="user-availability-email">{user.email}</p>
                      <p className="user-dept">{user.department}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                  ))}
                </TabPane>

                <TabPane tab="On Leave" key="3">
                  <TableHeadings />
                  {onLeave.map((user) => (
                    <div className="user-row" key={user.id}>
                      <p className="user-id">{user.id}</p>
                      <p className="user-fname">{user.firstname}</p>
                      <p className="user-lname">{user.lastname}</p>
                      <p className="user-availability-email">{user.email}</p>
                      <p className="user-dept">{user.department}</p>
                      <p className="user-role">{user.role}</p>
                    </div>
                  ))}
                </TabPane>

              </Tabs>
            </div>
            <div className="dashboard-group">
              <Link to={routes.AdminStats}>
                <button type="button" className="dashboard-btn">Overall Stats</button>
              </Link>
            </div>
            <div className="dashboard-group">
              <Link to={routes.AdminSettings}>
                <button type="button" className="dashboard-btn">Settings</button>
              </Link>
            </div>
          </div>
        ) : null}

    </section>
  );
};

export default AdminAvailabilityPage;
