import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Badge } from './components/ui/badge';

const App = () => {
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [excludedMedications, setExcludedMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mock data from Python server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/data", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setConditions(data.conditions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle condition selection
  const handleConditionChange = (value) => {
    const condition = conditions.find(c => c.id === parseInt(value));
    setSelectedCondition(condition);
    setSubCategories(condition ? condition.subCategories : []);
    setMedications(condition ? condition.medications : []);
    // Reset selections
    setSelectedSubCategories([]);
    setExcludedMedications([]);
  };

  // Handle subcategory selection
  const toggleSubCategory = (subCategoryId) => {
    setSelectedSubCategories(prev => 
      prev.includes(subCategoryId)
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  // Handle medication exclusion
  const toggleMedication = (medicationId) => {
    setExcludedMedications(prev => 
      prev.includes(medicationId)
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  // Audience targeting summary of mock data
  const calculateTargetAudience = () => {
    if (!selectedCondition) return null;

    const filteredSubcategories = selectedSubCategories.length > 0
      ? subCategories.filter(sub => selectedSubCategories.includes(sub.id))
      : subCategories;

    const remainingMedications = medications.filter(
      med => !excludedMedications.includes(med.id)
    );

    return {
      condition: selectedCondition.name,
      subcategories: filteredSubcategories.map(sub => sub.name),
      medications: remainingMedications.map(med => med.name)
    };
  };

  const targetAudience = calculateTargetAudience();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Healthcare Audience Targeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">

          {/* Condition Dropdown */}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Condition
            </label>
            <Select onValueChange={handleConditionChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(condition => (
                  <SelectItem 
                    key={condition.id} 
                    value={condition.id.toString()}
                  >
                    {condition.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategories */}

          {selectedCondition && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Subcategories
              </h3>
              <div className="flex flex-wrap gap-2">
                {subCategories.map(sub => (
                  <Badge 
                    key={sub.id}
                    variant={selectedSubCategories.includes(sub.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSubCategory(sub.id)}
                  >
                    {sub.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}

          {selectedCondition && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Exclude Medications
              </h3>
              <div className="space-y-2">
                {medications.map(med => (
                  <div key={med.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`med-${med.id}`}
                      checked={excludedMedications.includes(med.id)}
                      onCheckedChange={() => toggleMedication(med.id)}
                    />
                    <label
                      htmlFor={`med-${med.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {med.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience Summary */}
          
          {targetAudience && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-blue-800 mb-2">
                Target Audience Analysis
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>Condition: {targetAudience.condition}</p>
                {targetAudience.subcategories.length > 0 && (
                  <p>Subcategories: {targetAudience.subcategories.join(', ')}</p>
                )}
                {targetAudience.medications.length > 0 && (
                  <p>Available Medications: {targetAudience.medications.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;