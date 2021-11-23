import { useState, useEffect, forwardRef } from 'react';
import MaterialTable from 'material-table';
import {
  Typography,
  Grid,
  Button
} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const Web3 = require('web3');
const HttpProvider = 'https://mainnet.infura.io/v3/993cc65a5f134bd18e57f7435300e93b';
const web3 = new Web3(new Web3.providers.HttpProvider(HttpProvider));

let interval = true;

function App() {
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  const [lastBlock, setLastBlock] = useState({
    blockNumber: null,
    numberOfTransactions: 0,
    miner: '',
    totalDifficulty: '',
    transactions: []
  });

  const [status, setStatus] = useState({ apiStatus: 'resume', tempIndex: 0 });

  useEffect(() => {
    const runner = async () => {
      if (interval) {
        const block = web3.eth.getBlock('latest');
        await block.then(async data => {
          const transactions = [];
          for (var i = status.tempIndex; i < data.transactions.length; i ++) {
            // const txData = await web3.eth.getTransaction(data.transactions[i]);
            // transactions.push({ txId: data.transactions[i], amount: parseInt(txData.value) });
            transactions.push({ txId: data.transactions[i] });
          }
          setLastBlock({
            blockNumber: data.number,
            numberOfTransactions: data.transactions.length,
            miner: data.miner,
            totalDifficulty: data.totalDifficulty,
            transactions: [...lastBlock.transactions, ...transactions]
          });
        });
      }
    }

    setInterval(() => {
      runner();
    }, 3000);

    runner();
  }, []);

  const columns = [
    {
      title: 'Transaction Id',
      field: 'txId',
    },
    {
      title: 'Amount',
      field: 'amount',
      defaultSort: 'desc'
    }
  ];

  return (
    <div className="App">
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} justifyContent="center">
        <Grid item xs={8}>
          <br />
          <Typography variant="h5">Block Number: <strong>{lastBlock.blockNumber}</strong></Typography>
          <br />
          <Typography variant="h5">Number of transactions: <strong>{lastBlock.numberOfTransactions}</strong></Typography>
          <br />
          <Typography variant="h5">Miner: <strong>{lastBlock.miner}</strong></Typography>
          <br />
          <Typography variant="h5">Total difficulty: <strong>{lastBlock.totalDifficulty}</strong></Typography>
          <br />
          <Button onClick={() => {
            setStatus({ apiStatus: status.apiStatus === 'resume' ? 'pause' : 'resume' });
            interval = !interval;
          }} variant="outlined">{status.apiStatus === 'resume' ? 'Pause' : 'Resume'}</Button>
          <br /><br />
          <MaterialTable
            title={<Typography variant="h6">{lastBlock.transactions.length} Records Found</Typography>}
            icons={tableIcons}
            columns={columns}
            data={lastBlock.transactions}
            isLoading={!lastBlock.blockNumber}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [5, 10, 20, 50, 100],
              filtering: false,
              actionsCellStyle: {
                transform: 'scale(0.8)'
              },
              headerStyle: {
                backgroundColor: '#FAFAFA',
                borderTop: '1px solid #EEEEEE',
                paddingTop: '8px',
                paddingBottom: '8px',
              },
              padding: "dense",
            }}
            localization={{
              header: {
                actions: ''
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
