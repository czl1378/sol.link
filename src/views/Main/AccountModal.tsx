import React, { useState, useCallback, useEffect } from "react";

import { Modal, Button, Input, Form, Popconfirm, message, } from "antd";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { 
  PlusOutlined, LeftOutlined, SyncOutlined, 
  SelectOutlined, CopyOutlined, DeleteOutlined, 
} from "@ant-design/icons";

import store from "store";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useCurrAccount } from "../../hooks";
import styles from "./styles.module.less";

import { toShort } from "../../util/common";

function AccountModal({ visible, onCancel }): React.ReactElement {
  const [isNew, setIsNew] = useState(false);

  const [tmpAccount, setTmpAccount] = useState<any>();
  const { account, setAccount } = useCurrAccount();

  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleIsNew = useCallback(() => {
    setIsNew(!isNew);
    if (!isNew && account) {
      setTmpAccount(account);
      form.setFieldsValue({ mnemonic: account.mnemonic })
    }
  }, [isNew, account]);

  const [form] = Form.useForm();

  const newAccount = useCallback(() => {
    setIsLoading(true);
    // request({ api: "newAccount" }).then(data => {
    //   setIsLoading(false);
    //   setTmpAccount(data);
    //   form.setFieldsValue({ mnemonic: data.mnemonic })
    // }).catch(err => setIsLoading(false));
    // setTmpAccount(acc);
    // form.setFieldsValue({ secret: `[${acc.secretKey.toString()}]` })
  }, []);

  const onImport = useCallback((values) => {
   
    store.set("myWallet", JSON.stringify(tmpAccount));
    setBalance(0);
    setAccount(tmpAccount);
    setIsNew(false);
   
    // window.location.reload();
  }, [tmpAccount]);

  const onValuesChange = useCallback((values) => {
    
  }, []);

  const onRemove = useCallback(() => {
    store.remove("myWallet");
    setAccount(undefined);
    // window.location.reload();
  }, []);

  useEffect(() => {
    // get balance
    getBalance();
  }, [account]);

  const airdrop = useCallback(() => {
    setIsLoading(true);
    // request({ api: "airdrop", params: { pubkey: account.pubkey } })
    //   .finally(getBalance);
  }, [account]);

  const getBalance = useCallback(() => {
    if (!account) return;
    setIsLoading(true);
    // request({ api: "getBalance", params: { pubkey: account.pubkey } })
    //   .then(data => {
    //     setBalance(data.balance);
    //   })
    //   .finally(() => setIsLoading(false));
  }, [account]);

  return (
    <Modal visible={visible} onCancel={onCancel} className={styles.accountModal} 
        footer={null} width={520} destroyOnClose={true}>
      {
        isNew ?
        <div className={styles.back} onClick={toggleIsNew}>
          <LeftOutlined /> Back
        </div> :
        <div className={styles.title}>Account</div>
      }
      <div className={styles.main}>
        {
          isNew ?
          <div>
            <Form layout="vertical" onValuesChange={onValuesChange} onFinish={onImport} form={form}>
              <Form.Item label="Pubkey">
                <div style={{ 
                  background: "#fafafa", borderRadius: "3px", padding: "8px 10px",
                  border: "1px solid #e8e8e8"
                }}>
                  {tmpAccount ? tmpAccount.pubkey : "-"}
                </div>
              </Form.Item>
              <Form.Item name="mnemonic" label="Mnemonic">
                <Input placeholder="mnemonic" size="large" 
                  addonAfter={
                    <SyncOutlined style={{ cursor: "pointer", color: isLoading ? "#9a9a9a" : "#2c2c2c" }} onClick={newAccount} />
                } />
              </Form.Item>
              <Form.Item>
                <Button size="large" type="primary" style={{ width: "100%" }}
                  htmlType="submit">Import</Button>
              </Form.Item>
            </Form>
          </div> :
          <div>
            {
              account ?
              <div className={styles.account}>
                <div className={styles.header}>
                  <span>Current account</span>
                  <Button type="primary" ghost size="small" onClick={toggleIsNew}>Change</Button>
                </div>
                <div className={styles.content}>
                  <span className={styles.key}>{ toShort(account.pubkey) }</span>
                  <span className={styles.balance}>{balance/LAMPORTS_PER_SOL} SOL</span>
                  <Button type="link" loading={isLoading} disabled={isLoading} onClick={airdrop}>Airdrop</Button>
                </div>
                <div className={styles.footer}>
                  <CopyToClipboard text={account.pubkey} onCopy={() => message.info("Address copied!")}>
                  <a>
                    <CopyOutlined /> Copy address
                  </a>
                  </CopyToClipboard>
                  <a target="_blank" href={`https://explorer.solana.com/address/${account.pubkey}?cluster=devnet`}>
                    <SelectOutlined /> View on explorer
                  </a>
                
                  <Popconfirm title="Are you sure to remove this account?" onConfirm={onRemove}>
                    <a><DeleteOutlined /> Remove</a>
                  </Popconfirm>
                  
                </div>
              </div> :
              <div className={styles.import} onClick={toggleIsNew}>
                <div className={styles.icon}>
                  <PlusOutlined />
                </div>
                <span className={styles.label}>Add account</span>
              </div>
            }
          </div>
        }
      </div>
    </Modal>
  );
}

export default React.memo(AccountModal);