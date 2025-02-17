import { Grid, Skeleton, Container, ColSpan } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  reset,
  decrement,
  increment,
  incrementByAmount,
} from "../features/counter/counterSlice";
import { useState } from "react";
import WordleContainer from "../containers/wordle-container";


const child = <Skeleton width={40} height={40} radius="md" animate={false} />;

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { value } = useAppSelector((state) => state.counter);
  const [number, setNumber] = useState<number | "">(5);

  const columnSpan: ColSpan = 1;
  return (
    <div>
      <h1>This is dashboard component. Im here cause im authenticated!</h1>
      <h2>Test your counter app!</h2>

      <WordleContainer  />

      {/* <Container my="md">
        <Grid columns={5}>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
          <Grid.Col span={columnSpan}>{child}</Grid.Col>
        </Grid>
      </Container> */}

      {/* <Center className="flex flex-col">
        <Title order={1} className="text-[100px]">
          {value}
        </Title>
        <Flex gap={20}>
          <Button color="gray" onClick={() => dispatch(reset())}>
            Reset
          </Button>
          <Button color="green" onClick={() => dispatch(increment())}>
            Increment
          </Button>
          <Button color="red" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <NumberInput type="number" value={number} onChange={setNumber} />
          <Button onClick={() => dispatch(incrementByAmount(Number(number)))}>
            Increment By Amount
          </Button>
        </Flex>
      </Center> */}
    </div>
  );
};

export default Dashboard;
