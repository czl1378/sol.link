import React, { useState, useEffect, useCallback } from "react";

import { Row, Col, Statistic, Tooltip, Button, message, Input, Divider } from 'antd';

import { useParams, useLocation } from "react-router-dom";
import { LoadingOutlined, QuestionCircleOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";

import { AggregationChart } from "../../components";

import decodeAggregatorInfo from "../../util/decodeAggregatorInfo";
import decodeOracleInfo from "../../util/decodeOracleInfo";

import { Connection, PublicKey } from "@solana/web3.js";

import qs from "query-string";

import { useToggle, useCurrAccount } from "../../hooks";

import styles from "./styles.module.less";
import { endpoints, aggregators } from "../../util/common";

function Aggregator() {
  const { pubkey } = useParams();
  const [detail, setDetail] = useState<any>();

  const location = useLocation();
  let { cluster } = qs.parse(location.search);

  const { account } = useCurrAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [oracles, setOracles] = useState<any>();

  const [addModalVisible, toggleAddModalVisible] = useToggle();

  const [connection, setConnection] = useState<Connection>();

  useEffect(() => {
    
    if (!pubkey || !connection) return;

    setIsLoading(true);
    let submissions = null;
    connection.getAccountInfo(new PublicKey(pubkey))
      .then(res => {
        const aggregatorInfo = decodeAggregatorInfo(res);
        setDetail(aggregatorInfo);
        submissions = aggregatorInfo.submissions;
        const promises = aggregatorInfo.submissions.map(s => connection.getAccountInfo(s.oracle));
        return Promise.all(promises);
      })
      .then(list => {
        const tmpArr = list.map((o, idx) => ({
          ...decodeOracleInfo(o),
          submission: submissions[idx].value / 100
        }));
        setOracles(tmpArr);
      })
      .finally(() => setIsLoading(false));
   
  }, [pubkey, connection, detail]);

  useEffect(() => {
    if (!cluster) {
      cluster = "dev";
    }
    const endpoint = endpoints[cluster as string];
    if (!endpoint) return;

    setConnection(new Connection(endpoint, "singleGossip"));
  }, [cluster]);


  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submissionValue, setSubmissionValue] = useState<number|string>(0);

  return (
    <div className={styles.main}>
      <Row>
        <Col span={8}>
          {
            detail ?
            <>
              <div className={styles.title}>{detail.description.trim()} aggregation</div>
              <div className={styles.statistic}>
                <Statistic title={
                  <Tooltip title="Latest and trusted value">
                    Latest and trusted value <QuestionCircleOutlined />
                  </Tooltip>
                } value={detail.submissionValue} prefix="$" />
              </div>
              <div className={styles.statistic}>
                <Statistic title={
                  <Tooltip title="Oracles">
                    Oracles <QuestionCircleOutlined />
                  </Tooltip>
                } value={detail.submissions.length} />
              </div>
              <div className={styles.statistic}>
                <Statistic title={
                  <Tooltip title="Submission value range">
                    Submission value range <QuestionCircleOutlined />
                  </Tooltip>
                } 
                value={detail.minSubmissionValue.toString()} 
                suffix={`~${detail.maxSubmissionValue.toString()}`} />
              </div>
              
            </> :
            <div className={styles.loading}>
              <LoadingOutlined />
            </div>
          }
          
        </Col>
        <Col span={16}>
          <AggregationChart data={oracles} width={600} height={500} 
            value={detail?.submissionValue} loading={isLoading} />
        </Col>
      </Row>
      
    </div>
  );
}

export default React.memo(Aggregator);