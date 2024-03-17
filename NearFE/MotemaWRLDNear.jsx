let reciever = props.reciever || "armsveshack.near";

initState({ amount: 0.1, reciever });

const donate = () => {
  Near.call(
    state.reciever,
    "donate",
    {},
    "30000000000000",
    state.amount * 1e24
  );
};
const onChangeAmount = (amount) => {
  State.update({
    amount,
  });
};
const onChangeReciever = (reciever) => {
  State.update({
    reciever,
  });
};

if (!state.theme) {
  State.update({
    theme: styled.div`
  font-family: Manrope, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: bold;
  background-color: #FFFFFF;
  color: #0047AB;
  padding: 5px;
  border-radius: 0.45rem;
`,
  });
}
const Theme = state.theme;

const Navbar = styled.div`
display: flex;
justify-content: space-between;
padding: 10px;
`;

const LeftSide = styled.div`
display: flex;
gap: 10px;
`;

const RightSide = styled.div`
display: flex;
gap: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
`;

return (
  <Theme>
    <Navbar><img src="https://i.ibb.co/1T3Jd3m/banner.jpg" alt="Motema Banner"/></Navbar>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>
        <p>You just purchased iPhone 15 which contains 20 grams of cobalt!</p>
        <p>Do you want to help reduce the impact of cobalt mining in Democratic Republic of Congo? Donate to the cause!</p>
        <p>The money will be used to support the local communities and help them to find alternative sources of income.</p>
        <p>You will contribute with 0.1 Near</p>
      </span>
      <button
        disabled={context.loading}
        onClick={donate}
        className={`btn ${context.loading ? "btn-outline-dark" : "btn-primary"}`}
      >
        Donate {state.amount} NEAR to {state.reciever}
      </button>
      <Footer>
        <a href="https://near.social/mob.near/widget/MyPage?accountId=devgovgigs.near"><img src="https://i.ibb.co/BcD8HT2/powered-by-DH-dark.png" alt="MotemaWRLD Banner" target="_blank" /></a>
      </Footer>
    </div>
  </Theme>
);