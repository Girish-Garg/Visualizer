import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import poissonPMF from '@stdlib/stats-base-dists-poisson-pmf';
import binomialPMF from '@stdlib/stats-base-dists-binomial-pmf';
import sqrt from '@stdlib/math-base-special-sqrt';
import max from '@stdlib/math-base-special-max';
import ceil from '@stdlib/math-base-special-ceil';
import { poissonSchema, binomialSchema } from '../utils/schema.zod';
import Poisson from './Poisson';
import Binomial from './Binomial';
import cross from '../utils/cross.svg';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const StatsVisualizer = () => {
    const [distributions, setDistributions] = useState([]);
    const [distributionType, setDistributionType] = useState('poisson');
    const [inputValues, setInputValues] = useState({
        lambda: '',
        n: '',
        p: ''
    });

    const colors = [
        { border: '#4bc0c0', background: '#4bc0c033' },
        { border: '#ff6384', background: '#ff638433' },
        { border: '#ffcd56', background: '#ffcd5633' },
        { border: '#36a2eb', background: '#36a2eb33' },
        { border: '#9966ff', background: '#9966ff33' }
    ];

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setInputValues({ ...inputValues, [field]: value });
    };

    const validateInputs = () => {
        let validationResult;

        switch (distributionType) {
            case 'poisson':
                validationResult = poissonSchema.safeParse({
                    lambda: inputValues.lambda
                });
                break;
            case 'binomial':
                validationResult = binomialSchema.safeParse({
                    n: inputValues.n,
                    p: inputValues.p
                });
                break;
            default:
                return false;
        }

        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors[0].message;
            alert(errorMessage);
            return false;
        }

        return true;
    };

    const calculateStats = async () => {
        if (!validateInputs()) return;

        let newDistribution = {
            id: Date.now(),
            type: distributionType,
            name: `${distributionType} ${distributions.length + 1}`,
            parameters: {},
            color: colors[distributions.length % colors.length]
        };

        try {
            switch (distributionType) {
                case 'poisson':
                    const lambda = parseFloat(inputValues.lambda);
                    newDistribution.parameters = { lambda };
                    break;

                case 'binomial':
                    const n = parseInt(inputValues.n);
                    const p = parseFloat(inputValues.p);
                    newDistribution.parameters = { n, p };
                    break;
            }

            setDistributions([...distributions, newDistribution]);

            setInputValues({
                lambda: '',
                n: '',
                p: ''
            });
        } catch (error) {
            console.error('Error calculating statistics:', error);
            alert('Failed to calculate statistics. Please try again.');
        }
    };

    const removeDistribution = (id) => {
        setDistributions(distributions.filter(dist => dist.id !== id));
    };

    const clearAll = () => {
        setDistributions([]);
        setInputValues({
            lambda: '',
            n: '',
            p: ''
        });
    };

    const getChartData = () => {
        let maxX = 0;

        for (const dist of distributions) {
            if (dist.type === 'poisson') {
                const poissonMaxX = ceil(dist.parameters.lambda + 3 * sqrt(dist.parameters.lambda));
                maxX = max(maxX, poissonMaxX);
            } else {
                maxX = max(maxX, dist.parameters.n);
            }
        }

        const xValues = [];
        for (let i = 0; i <= maxX; i++) {
            xValues.push(i);
        }

        const datasets = [];

        for (let i = 0; i < distributions.length; i++) {
            const dist = distributions[i];
            const color = colors[i % colors.length];

            if (dist.type === 'poisson') {
                const data = [];
                for (const x of xValues) {
                    data.push(poissonPMF(x, dist.parameters.lambda));
                }

                datasets.push({
                    type: 'bar',
                    label: `Poisson (λ=${dist.parameters.lambda})`,
                    data,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    borderWidth: 1
                });
            } else if (dist.type === 'binomial') {
                const data = [];
                for (const x of xValues) {
                    if (x <= dist.parameters.n) {
                        data.push(binomialPMF(x, dist.parameters.n, dist.parameters.p));
                    } else {
                        data.push(0);
                    }
                }

                datasets.push({
                    type: 'bar',
                    label: `Binomial (n=${dist.parameters.n}, p=${dist.parameters.p})`,
                    data,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    borderWidth: 1
                });
            }
        }

        return {
            labels: xValues,
            datasets
        };
    };

    const renderDistributionInputs = () => {
        switch (distributionType) {
            case 'poisson':
                return <Poisson
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                />;

            case 'binomial':
                return <Binomial
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                />;

            default:
                return null;
        }
    };

    const renderDistributionItem = (dist) => {
        switch (dist.type) {
            case 'poisson':
                return (
                    <div className="text-sm text-gray-300 space-y-1">
                        <p>Lambda (λ): {dist.parameters.lambda}</p>
                        <p>Mean: {dist.parameters.lambda}</p>
                        <p>Variance: {dist.parameters.lambda}</p>
                    </div>
                );

            case 'binomial':
                return (
                    <div className="text-sm text-gray-300 space-y-1">
                        <p>Trials (n): {dist.parameters.n}</p>
                        <p>Probability (p): {dist.parameters.p}</p>
                        <p>Mean (np): {(dist.parameters.n * dist.parameters.p).toFixed(4)}</p>
                        <p>Variance (np(1-p)): {(dist.parameters.n * dist.parameters.p * (1 - dist.parameters.p)).toFixed(4)}</p>
                    </div>
                );

            default:
                return null;
        }
    };

    const chartData = getChartData();

    return (
        <div className="w-full min-h-screen bg-gray-900 text-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400">Probability Distribution Stats</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">Input Distribution Parameters</h3>

                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-cyan-300">Distribution Type:</label>
                            <select
                                value={distributionType}
                                onChange={(e) => setDistributionType(e.target.value)}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 hover:cursor-pointer"
                            >
                                <option value="poisson" className='hover:cursor-pointer'>Poisson Distribution</option>
                                <option value="binomial" className='hover:cursor-pointer'>Binomial Distribution</option>
                            </select>
                        </div>

                        {renderDistributionInputs()}

                        <button
                            onClick={calculateStats}
                            className="mt-5 w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-cyan-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                        >
                            Add Distribution
                        </button>
                    </div>
                    {distributions.length > 0 && (
                        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-cyan-400">Added Distributions</h3>
                                <button
                                    onClick={clearAll}
                                    className="text-red-400 hover:text-red-300 text-sm hover:cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {distributions.map((dist) => (
                                    <div key={dist.id} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium" style={{ color: dist.color.border }}>{dist.name}</h4>
                                            {renderDistributionItem(dist)}
                                        </div>
                                        <button
                                            onClick={() => removeDistribution(dist.id)}
                                            className="text-gray-400 hover:text-red-400"
                                        >
                                            <img src={cross} className="w-4 h-4 hover:cursor-pointer" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:w-2/3 bg-gray-800 p-5 rounded-lg shadow-lg">
                    <div className="h-[80vh]">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                        labels: {
                                            color: '#e5e7eb',
                                            padding: 20,
                                            font: { size: 12 }
                                        }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `Probability: ${context.parsed.y.toFixed(6)}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    y: {
                                        ticks: { color: '#e5e7eb' },
                                        grid: { color: '#6b72801a' },
                                        title: {
                                            display: true,
                                            text: 'Probability Mass',
                                            color: '#e5e7eb'
                                        }
                                    },
                                    x: {
                                        ticks: { color: '#e5e7eb' },
                                        grid: { color: '#6b72801a' },
                                        title: {
                                            display: true,
                                            text: 'Values',
                                            color: '#e5e7eb'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsVisualizer;