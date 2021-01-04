import React, { useCallback, useState } from "react";

import { Modal, Form, Input, Row, Col, Button, message } from "antd";

import { useCurrAccount } from "../../hooks";

import styles from "./styles.module.less";

import decodeAggregatorInfo from "../../util/decodeAggregatorInfo";
import { Connection, PublicKey } from "@solana/web3.js";

function AddModal({ 
  visible, 
  onCancel, 
  connection, 
  onOk 
}: {
  visible: boolean;
  onCancel?: () => void;
  connection: Connection;
  onOk?: (address: string) => void;
}) {

  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState<string>();
  const [address, setAddress] = useState<string>();

  const onAddressChange = useCallback(({ target }) => {
    if (!target.value || !connection) return;

    try {
      let pubkey = new PublicKey(target.value);
    
      setIsLoading(true);
      setAddress(target.value);
      connection.getAccountInfo(pubkey)
        .then(res => {
          const { description } = decodeAggregatorInfo(res);
          setDescription(description);
        })
        .finally(() => {
          setIsLoading(false);
        });
        
    } catch(e) {
      console.log(e);
    }
    
  }, [connection]);

  return (
    <Modal visible={visible} onCancel={onCancel} className={styles.addModal}
      footer={null} destroyOnClose={true} width={420}>
      <div className={styles.title}>Add Aggregator</div>
      <div className={styles.content}>
        <Form layout="vertical" onFinish={() => onOk(address)}>
          <Form.Item name="pubkey" extra={
            description ? <span>Pair name: {description}</span> : null
          }>
            <Input placeholder="aggregator address" size="large" maxLength={48} onChange={onAddressChange} />
          </Form.Item>
         
          <Form.Item>
            <Button size="large" type="primary" style={{ width: "100%" }}
              htmlType="submit" disabled={!description || isLoading} loading={isLoading}>Add</Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default React.memo(AddModal);