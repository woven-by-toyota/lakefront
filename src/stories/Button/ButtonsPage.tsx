import { FC } from 'react';
import Button from 'src/components/Button/Button';
import styled from '@emotion/styled';

const DefaultWrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.backgrounds.primary,
  fontFamily: '"Source Sans Pro", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  hr: {
    width: '100%',
  }
}));

const AlternateWrapper = styled(DefaultWrapper)(({ theme }) => ({
  backgroundColor: theme.backgrounds.inverted
}));

const Section = styled.div({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 32,
    width: '40%'
});

const SectionLabel = styled.h2<{ alternate?: boolean }>(({ theme, alternate }) => ({
  color: alternate ? theme.foregrounds.inverted : theme.foregrounds.primary,
  margin: 32
}));

const DEFAULT_STATES_LABEL = 'Default States';
const DISABLED_STATES_LABEL = 'Disabled States';

const ButtonsPage: FC = () => {
    return (
        <div>
            <DefaultWrapper>
                <SectionLabel>{DEFAULT_STATES_LABEL}</SectionLabel>
                <Section>
                    <Button>Primary</Button>
                    <Button icon>Primary</Button>
                    <Button icon/>
                </Section>
                <Section>
                    <Button color="secondary">Secondary</Button>
                    <Button icon color="secondary">Secondary</Button>
                </Section>
                <Section>
                    <Button color="destructive">Destructive</Button>
                    <Button icon color="destructive">Destructive</Button>
                    <Button color="destructive" icon/>
                </Section>
                <Section>
                  <Button color="link">Link</Button>
                  <Button icon color="link">Link</Button>
                  <Button color="link" icon/>
                </Section>
                <SectionLabel >{DISABLED_STATES_LABEL}</SectionLabel>
                <Section>
                    <Button disabled>Primary</Button>
                    <Button icon disabled>Primary</Button>
                    <Button icon disabled/>
                </Section>
                <Section>
                    <Button color="secondary" disabled>Secondary</Button>
                    <Button icon color="secondary" disabled>Secondary</Button>
                </Section>
                <Section>
                    <Button color="destructive" disabled>Destructive</Button>
                    <Button icon color="destructive" disabled>Destructive</Button>
                    <Button color="destructive" icon disabled/>
                </Section>
              <Section>
                <Button color="link" disabled>Link</Button>
                <Button icon color="link" disabled>Link</Button>
                <Button color="link" icon disabled/>
              </Section>
            </DefaultWrapper>
            <AlternateWrapper>
                <SectionLabel alternate>Alternate {DEFAULT_STATES_LABEL}</SectionLabel>
                <Section>
                    <Button alternate>Primary</Button>
                    <Button icon alternate>Primary</Button>
                    <Button icon alternate/>
                </Section>
                <Section>
                    <Button color="secondary" alternate>Secondary</Button>
                    <Button icon color="secondary" alternate>Secondary</Button>
                </Section>
                <Section>
                    <Button color="destructive" alternate>Destructive</Button>
                    <Button icon color="destructive" alternate>Destructive</Button>
                    <Button color="destructive" icon alternate/>
                </Section>
                <Section>
                  <Button color="link" alternate>Link</Button>
                  <Button icon color="link" alternate>Link</Button>
                  <Button color="link" icon alternate/>
                </Section>
                <SectionLabel alternate>Alternate {DISABLED_STATES_LABEL}</SectionLabel>
                <Section>
                    <Button alternate disabled>Primary</Button>
                    <Button icon alternate disabled>Primary</Button>
                    <Button icon alternate disabled/>
                </Section>
                <Section>
                    <Button color="secondary" alternate disabled>Secondary</Button>
                    <Button icon color="secondary" alternate disabled>Secondary</Button>
                </Section>
                <Section>
                    <Button color="destructive" alternate disabled>Destructive</Button>
                    <Button icon color="destructive" alternate disabled>Destructive</Button>
                    <Button color="destructive" icon alternate disabled/>
                </Section>
                <Section>
                  <Button color="link" alternate disabled>Link</Button>
                  <Button icon color="link" alternate disabled>Link</Button>
                  <Button color="link" icon alternate disabled/>
                </Section>
            </AlternateWrapper>
        </div>
    );
};
export default ButtonsPage;
