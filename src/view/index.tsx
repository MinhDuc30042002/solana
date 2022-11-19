import IonIcon from '@sentre/antd-ionicon'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Image, Col, Layout, Row, Space, Typography, Button } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

import logo from 'static/images/solanaLogo.svg'
import brand from 'static/images/solanaLogoMark.svg'

import './index.less'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'

function View() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false)

  const getMyBalance = useCallback(async () => {
    if (!publicKey) return setBalance(0)
    const lamports = await connection.getBalance(publicKey)
    return setBalance(lamports)
  }, [connection, publicKey])

  const airdrop = useCallback(async () => {
    try {
      setLoading(true)
      if (publicKey) {
        await connection.requestAirdrop(publicKey, 10 ** 8)
        return getMyBalance()
      }
    } catch (error: any) {
      console.log(error.message)
    } finally {
      return setLoading(false)
    }

  }, [connection, publicKey, getMyBalance])

  const transfer = useCallback(async () => {
    try {
      setLoading(true)
      if (publicKey) {
        const instruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 10 ** 1,
        })

        const transaction = new Transaction().add(instruction)

        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

        return getMyBalance()
      }
    } catch (error: any) {
      console.log(error.message)
    } finally {
      return setLoading(false)
    }

  }, [connection, publicKey, getMyBalance])

  useEffect(() => {
    getMyBalance()
  }, [getMyBalance])
  return (
    <Layout className="container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col flex="auto">
              <img src={brand} alt="logo" height={16} />
            </Col>
            <Col>
              <WalletMultiButton />
              {/* <WalletDisconnectButton /> */}
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Space direction="vertical" size={24}>
            <Image src={logo} preview={false} width={256} />
            <Typography.Title level={1}>React + Solana = DApp</Typography.Title>
            <Typography.Text type="secondary">
              <Space>
                <IonIcon name="logo-react" />
                +
                <IonIcon name="logo-solana" />
                =
                <IonIcon name="rocket" />
              </Space>
            </Typography.Text>
            <Typography.Text>My balance: {balance / 10 ** 9} SOL</Typography.Text>
            <Button onClick={airdrop} type='primary' size='large' loading={loading}>Airdrop</Button>
            <Button onClick={transfer} type='primary' size='large' loading={loading}>Transfer</Button>
          </Space>
        </Col>
      </Row>
    </Layout>
  )
}

export default View
