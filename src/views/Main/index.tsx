import React, { useState, useCallback, useEffect } from 'react';

import { Menu, Tag, Layout } from 'antd';
import store from 'store';

import { Outlet, Link, useLocation } from 'react-router-dom';

import { UserOutlined, SettingOutlined } from '@ant-design/icons';

import AccountModal from './AccountModal';

import styles from './styles.module.less';
import logo from '../../assets/logo.png';

import { useCurrAccount, useToggle } from '../../hooks';
import { toShort } from '../../util/common';

const myWallet = store.get('myWallet');

const { Header, Content, Footer } = Layout;

function Main(): React.ReactElement {
  const location = useLocation();

  const [accountModalVisible, toggleAccountModalVisible] = useToggle();
  const [settingModalVisible, toggleSettingModalVisible] = useToggle();

  const { account, setAccount } = useCurrAccount();
 
  useEffect(() => {
    if (myWallet != null) {
      setAccount(JSON.parse(myWallet));
    }
  }, []);

  return (
    <>
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <a className={styles.logo} href='.'>
              <img src={logo} />
            </a>
            <Menu mode='horizontal' className={styles.menu}
              selectedKeys={[location.pathname.split('/')[1]]}>
              <Menu.Item key='home'>
                <Link to='/home'>Home</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className={styles.headerRight}>
            {/* <div className={styles.account} onClick={toggleAccountModalVisible}>
              <UserOutlined />
              <span style={{ marginLeft: '5px' }}>
                { account ? toShort(account.pubkey) : 'Login' }
              </span>
            </div> */}
            <div className={styles.setting}  onClick={toggleSettingModalVisible}>
              <SettingOutlined />
            </div>
          </div>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
        <Footer className={styles.footer}>
          {/* <span>Copyright @ Solink 2020</span> */}
        </Footer>
        <AccountModal visible={accountModalVisible} onCancel={toggleAccountModalVisible} />
        
      </Layout>
    </>
  );
}

export default React.memo(Main);