import { styled } from '../../../../../../stitches.config';
import Box from '../../../../../Primitives/Box';
import Flex from '../../../../../Primitives/Flex';

const MainContainer = styled(Flex, Box, {
	backgroundColor: 'white',
	height: '$76',
	width: '100%',
	borderRadius: '$12',
	px: '$24',
	py: '$22'
});

const Container = styled(Flex, Box, {});

export { Container, MainContainer };
