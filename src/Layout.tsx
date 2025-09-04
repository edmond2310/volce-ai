import { Flex, Box } from '@radix-ui/themes';
import Left from './Left.tsx'
import Right from './Right.tsx'

const Layout = () => {
  return (
    <Flex height="100vh">
      {/* 侧边栏 */}
      <Box
        width="360px"
        p="4"
        style={{ borderRight: '1px solid var(--gray-6)' }}
      >
        <Left></Left>
      </Box>

      {/* 主内容区 */}
      <Box>
        <Right></Right>
      </Box>
    </Flex>
  );
}

export default Layout;