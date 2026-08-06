import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Label from './Label';
import Select from './Select';
import Card, { CardHeader, CardContent, CardFooter } from './Card';
import Slider from './Slider';
import Switch from './Switch';
import Checkbox from './Checkbox';
import RadioGroup from './RadioGroup';
import Textarea from './Textarea';
import Alert from './Alert';
import Progress from './Progress';
import Tabs from './Tabs';

const CustomComponentsDemo: React.FC = () => {
  const [selectValue, setSelectValue] = useState('');
  const [sliderValue, setSliderValue] = useState(50);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [textareaValue, setTextareaValue] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProgress(100);
  };

  return (
    <Card>
      <CardHeader>
        <h2>Custom Components Demo</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label htmlFor="role">Role</Label>
            <Select
              options={[
                { value: 'developer', label: 'Developer' },
                { value: 'designer', label: 'Designer' },
                { value: 'manager', label: 'Manager' },
              ]}
              onChange={setSelectValue}
              placeholder="Select your role"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Experience (years)</Label>
            <Slider
              min={0}
              max={20}
              step={1}
              value={sliderValue}
              onChange={setSliderValue}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Notifications</Label>
            <Switch checked={switchValue} onChange={setSwitchValue} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Checkbox
              label="I agree to the terms and conditions"
              checked={checkboxValue}
              onChange={setCheckboxValue}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Preferred Contact Method</Label>
            <RadioGroup
              options={[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone' },
                { value: 'mail', label: 'Mail' },
              ]}
              name="contactMethod"
              value={radioValue}
              onChange={setRadioValue}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
              placeholder="Enter your comments"
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <Alert
            title="Form Submitted"
            description="Your form has been successfully submitted."
            variant="success"
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Label>Submission Progress</Label>
          <Progress value={progress} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <Tabs
            tabs={[
              { label: 'Tab 1', content: <p>Content for Tab 1</p> },
              { label: 'Tab 2', content: <p>Content for Tab 2</p> },
              { label: 'Tab 3', content: <p>Content for Tab 3</p> },
            ]}
          />
        </div>
      </CardContent>
      <CardFooter>
        <p>Thank you for using our custom components!</p>
      </CardFooter>
    </Card>
  );
};

export default CustomComponentsDemo;

