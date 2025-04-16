import { Button } from "@/components/ui/button"
import { CardWrapper } from "@/components/ui/card-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StyleGuide() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Style Guide</h1>
      <p className="text-muted-foreground">
        This style guide demonstrates the standardized components and their usage across the application.
      </p>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6 pt-4">
          <h2 className="text-2xl font-semibold">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardWrapper title="Default Card" description="This is the default card style" variant="default">
              <p>This card uses the default styling with standard padding and borders.</p>
            </CardWrapper>

            <CardWrapper title="Outline Card" description="A more subtle card style" variant="outline">
              <p>This card uses the outline variant with a lighter appearance.</p>
            </CardWrapper>

            <CardWrapper title="Ghost Card" description="Minimal styling for subtle grouping" variant="ghost">
              <p>This card uses the ghost variant with no borders.</p>
            </CardWrapper>

            <CardWrapper title="Interactive Card" description="For clickable card elements" variant="interactive">
              <p>This card has hover effects to indicate it's interactive.</p>
            </CardWrapper>
          </div>

          <h2 className="text-2xl font-semibold mt-8">Card Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardWrapper title="Small Card" description="Compact size" size="sm">
              <p>This card uses small padding and spacing.</p>
            </CardWrapper>

            <CardWrapper title="Medium Card" description="Standard size" size="md">
              <p>This card uses medium padding and spacing (default).</p>
            </CardWrapper>

            <CardWrapper title="Large Card" description="Spacious layout" size="lg">
              <p>This card uses large padding and spacing for content-heavy sections.</p>
            </CardWrapper>
          </div>

          <h2 className="text-2xl font-semibold mt-8">Card with Footer</h2>
          <CardWrapper
            title="Card with Footer"
            description="Demonstrates footer usage"
            footer={
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button>Save</Button>
              </div>
            }
          >
            <p>This card includes a footer section with action buttons.</p>
          </CardWrapper>

          <h2 className="text-2xl font-semibold mt-8">Card with Header Action</h2>
          <CardWrapper
            title="Card with Header Action"
            description="Demonstrates header action usage"
            headerAction={<Button size="sm">View All</Button>}
          >
            <p>This card includes an action button in the header.</p>
          </CardWrapper>
        </TabsContent>

        <TabsContent value="buttons" className="pt-4">
          <h2 className="text-2xl font-semibold">Button Styles</h2>
          <p>Button styles documentation would go here.</p>
        </TabsContent>

        <TabsContent value="typography" className="pt-4">
          <h2 className="text-2xl font-semibold">Typography</h2>
          <p>Typography documentation would go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
