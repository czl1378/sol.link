import React, { useEffect, useState, useCallback } from "react";

import { Row, Col, message } from "antd";
import { LoadingOutlined, PlusOutlined, DeploymentUnitOutlined, CloseOutlined } from "@ant-design/icons";

import { useCurrAccount, useToggle } from "../../hooks";

import decodeAggregatorInfo from "../../util/decodeAggregatorInfo";
import { Connection, PublicKey } from "@solana/web3.js";

import styles from "./styles.module.less";
import { endpoints, aggregators } from "../../util/common";

import { Link, useLocation } from 'react-router-dom';

import qs from "query-string";
import store from "store";

import AddModal from "./AddModal";

const storedAggregators = store.get("aggregators");

function Home() {

  const location = useLocation();
  let { cluster } = qs.parse(location.search);

  const [isLoading, setIsLoading] = useState(false);

  const [addModalVisible, toggleAddModalVisible] = useToggle();

  const [aggregatorList, setAggregatorList] = useState([]);

  const [connection, setConnection] = useState<Connection>();

  const [infos, setInfos] = useState([]);

  useEffect(() => {
   
    setAggregatorList((aggregators || []).concat(
      storedAggregators ? JSON.parse(storedAggregators) : []
    ));

  }, []);

  useEffect(() => {
    if (!cluster) {
      cluster = "dev";
    }

    const endpoint = endpoints[cluster as string];

    if (!endpoint) return;

    setConnection(new Connection(endpoint, "singleGossip"));
  }, [cluster]);

  useEffect(() => {

    if (!connection || !aggregatorList || aggregatorList.length < 1) {
      return;
    }
    setIsLoading(true);
    
    const promises = aggregatorList.map(a => {
      return connection.getAccountInfo(new PublicKey(a.address));
    });
    
    Promise.all(promises)
      .then(results => {
        const tmpInfos = results.map(res => decodeAggregatorInfo(res));
        setInfos(tmpInfos);
      })
      .catch(err => {
        message.error(err.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [aggregatorList, connection]);

  const onOk = useCallback((address) => {
    let customAggregators = storedAggregators ? JSON.parse(storedAggregators) : [];
    store.set("aggregators", JSON.stringify([
      ...customAggregators,
      { address, custom: true }
    ]));
    window.location.reload();
  }, [aggregatorList, storedAggregators]);

  const removeCustom = useCallback((e, idx) => {
    e.preventDefault();
    let tmpArr = JSON.parse(storedAggregators);
    tmpArr.splice(idx - aggregators.length, 1);
    store.set("aggregators", JSON.stringify(tmpArr));
    window.location.reload();
  }, [storedAggregators]);

  return (
    <div className={styles.main}>
      {
        isLoading ?
        <div className={styles.loading}>
          <LoadingOutlined />
        </div> :
        <>
          <div className={styles.title}>Decentralized Price Feeds for Fiat Pairs</div>
          <Row gutter={[30, 30]}>
            {
              aggregatorList?.map((a, idx) => {
                const aggregator = infos[idx] || {};
                return (
                  <Col span={8} key={idx}>
                    <Link to={`/aggregator/${a.address}${cluster ? "?cluster=" + cluster : ""}`}>
                    <div className={styles.pair}>
                      <div className={styles.title}>{aggregator?.description}</div>
                      <div className={styles.price}>
                        ${ aggregator.submissionValue }
                      </div>
                      <div className={styles.oracles}>
                        <DeploymentUnitOutlined /> Powered by {aggregator.submissions?.length} oracles
                      </div>
                      {
                        a.custom ? 
                        <>
                          <div className={styles.custom}>Custom</div>
                          <div className={styles.closer} onClick={(e) => removeCustom(e, idx)}><CloseOutlined /></div>
                        </> : null
                      }
                    </div>
                    </Link>
                  </Col>
                );
              })
            }
            <Col span={8}>
              <div className={styles.addBtn} onClick={toggleAddModalVisible}>
                <div className={styles.icon}><PlusOutlined /></div>
                <div className={styles.label}>Add Aggregator</div>
              </div>
            </Col>
          </Row>
        </>
      }
      <AddModal connection={connection} onOk={onOk} 
        visible={addModalVisible} onCancel={toggleAddModalVisible} />
      
    </div>
  );
}

export default React.memo(Home);