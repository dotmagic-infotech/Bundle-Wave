// Shopify Imports
import { SkeletonPage, Layout, LegacyCard, SkeletonBodyText, TextContainer, SkeletonDisplayText } from '@shopify/polaris';

const PageSkeleton = () => {

    return (
        <SkeletonPage backAction primaryAction>
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned>
                        <SkeletonBodyText />
                    </LegacyCard>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </LegacyCard>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </LegacyCard>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </LegacyCard>
                    <LegacyCard sectioned>
                        <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                        </TextContainer>
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section variant="oneThird">
                    <LegacyCard>
                        <LegacyCard.Section>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText lines={2} />
                            </TextContainer>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={1} />
                        </LegacyCard.Section>
                    </LegacyCard>
                    <LegacyCard>
                        <LegacyCard.Section>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText lines={2} />
                            </TextContainer>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={1} />
                        </LegacyCard.Section>
                    </LegacyCard>
                    <LegacyCard subdued>
                        <LegacyCard.Section>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText lines={2} />
                            </TextContainer>
                        </LegacyCard.Section>
                        <LegacyCard.Section>
                            <SkeletonBodyText lines={2} />
                        </LegacyCard.Section>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </SkeletonPage>
    );
}

export default PageSkeleton