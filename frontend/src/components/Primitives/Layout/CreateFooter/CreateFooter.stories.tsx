import React from 'react';
import { ComponentStory } from '@storybook/react';

import CreateFooter from '@/components/Primitives/Layout/CreateFooter/CreateFooter';
import dedent from 'ts-dedent';

export default {
  title: 'Primitives/Layout/CreateFooter',
  component: CreateFooter,
  parameters: {
    layout: 'start',
    docs: {
      description: {
        component: dedent`
        Header used in create pages.

        **File Path:**
        \`@/components/Primitives/Layout/CreateFooter.tsx\`
        `,
      },
    },
  },
  args: {
    disableButton: false,
    hasError: false,
    handleBack: () => alert('Go Back'),
    formId: '',
    confirmationLabel: 'Lorem Ipsum',
  },
  argTypes: {
    disableButton: {
      description: 'Used to disable the footer buttons.',
    },
    hasError: {
      description: 'Used to disable the submit button.',
    },
    handleBack: {
      description: 'Function executed when the back button is clicked.',
    },
    formId: {
      description: 'ID of the form to submit.',
    },
    confirmationLabel: {
      description: 'Confirmation button text.',
    },
  },
};

const Template: ComponentStory<typeof CreateFooter> = ({ ...args }) => <CreateFooter {...args} />;

export const Default = Template.bind({});
Default.storyName = 'Basic Usage';
