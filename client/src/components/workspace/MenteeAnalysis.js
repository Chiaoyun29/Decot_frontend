import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { getMenteeAnalysisData } from "../services/api";
import { useAuthContext } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import CustomModal from '../common/CustomModal';
import icon_cross from "../../image/icon_cross.svg"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const MenteeAnalysis = () => {
    const { workspaceId } = useParams();
    const [analysisData, setAnalysisData] = useState(null);
    const { token } = useAuthContext();
    const navigate = useNavigate();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const fetchAnalysisData = async () => {
            const response = await getMenteeAnalysisData(workspaceId, token);
            if (response && !response.error) {
                setAnalysisData(response.analysisData);
            } else {
                console.error('Error fetching analysis data:', response.error);
            }
        };
        fetchAnalysisData();
    }, [workspaceId, token]);

    if (!analysisData) {
        return (
            <div className="p-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-violet-400"></div>
        );
    }

    const handleClose = () => {
        navigate(`/workspace/${workspaceId}`);
    };

    const openModal = (chart) => {
        setModalContent(chart);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const OverallEngagementRateChart = () => {
        if (!analysisData || !analysisData.engagementRate) {
            return <div>Loading...</div>;
        }

        const overallChartData = {
            labels: ['Overall Engagement Rate'],
            datasets: [{
                label: 'Overall Engagement Rate',
                data: [analysisData.engagementRate.overallEngagementRate],
                backgroundColor: COLORS,
            }]
        };

        return (
            <div className="">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Overall Engagement Rate</h2>
                <Bar data={overallChartData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true } } }} />
            </div>
        );
    };

    const MenteeEngagementRatesChart = () => {
        if (!analysisData || !analysisData.engagementRate) {
            return <div>Loading...</div>;
        }

        const menteeChartData = {
            labels: analysisData.engagementRate.menteeEngagementRates.map(mentee => mentee.username),
            datasets: [{
                label: 'Individual Engagement Rates',
                data: analysisData.engagementRate.menteeEngagementRates.map(mentee => mentee.engagementRate),
                backgroundColor: COLORS,
            }]
        };

        return (
            <div className="">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Mentee Engagement Rate</h2>
                <Bar data={menteeChartData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true } } }} />
            </div>
        );
    };

    const BoardStagePieChart = () => {
        if (!analysisData || !analysisData.boardStagePercentages) {
            return <div>Loading...</div>;
        }

        const chartData = {
            labels: Object.keys(analysisData.boardStagePercentages),
            datasets: [{
                data: Object.values(analysisData.boardStagePercentages),
                backgroundColor: COLORS,
                hoverOffset: 4
            }]
        };

        return (
            <div className="">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Board Stage Percentage</h2>
                <Pie data={chartData} />
            </div>
        );
    };

    const BoardCompletionRateChart = () => {
        const boardCompletionRate = analysisData?.boardCompletionRate ?? 0; // Use optional chaining

        const completionData = {
            labels: ['Board Completion Rate'],
            datasets: [{
                label: 'Completion Rate',
                data: [boardCompletionRate],
                backgroundColor: COLORS,
            }]
        };

        return (
            <div className="">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Board Completion Rate</h2>
                <Bar data={completionData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true, max: 100 } } }} />
            </div>
        );
    };

    const BoardCompletionRatesByStageChart = () => {
        const { totalCompleted, totalIncomplete, completionDetails } = analysisData?.boardCompletionRatesByStage ?? {};
        const [showDetails, setShowDetails] = useState(false);
      
        const overallChartData = {
          labels: ['Completed', 'Incomplete'],
          datasets: [{
            label: 'Board Completion Rate',
            data: [totalCompleted, totalIncomplete],
            backgroundColor: COLORS,
          }]
        };
      
        const DetailedStageWiseChart = ({ data, label }) => {
          const chartData = {
            labels: Object.keys(data),
            datasets: [{
              label: label,
              data: Object.values(data),
              backgroundColor: COLORS,
            }]
          };
      
          return <Bar data={chartData} options={{ indexAxis: 'y', scales: { x: { beginAtZero: true } } }} />;
        };
      
        return (
          <div className="">
            <h2 className="text-lg font-semibold leading-7 text-gray-900">Board Completion Percentage By Stage</h2>
            <button onClick={() => setShowDetails(!showDetails)} className="text-blue-500 underline">
              {showDetails ? 'Show Overall Rates' : 'Show Detailed Stage-Wise Rates'}
            </button>
            {!showDetails ? (
              <Pie data={overallChartData} />
            ) : (
              <div>
                <DetailedStageWiseChart data={completionDetails.completed} label="Percentage Of Completed Board By Stage" />
                <DetailedStageWiseChart data={completionDetails.incomplete} label="Percentage Of Incomplete Board By Stage" />
              </div>
            )}
          </div>
        );
      };
      
      

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    {/* Empty div for spacing */}
                    <div></div>
                    <h2 className="text-2xl font-semibold text-gray-800">Mentee Analysis</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-700 font-semibold p-2 rounded inline-flex items-center justify-center hover:bg-gray-200 transition-colors duration-150"
                        aria-label="Close"
                    >
                        <img src={icon_cross} alt="x mark" />
                    </button>
                </div>
                <div className="bg-indigo-100 bg-opacity-50 rounded-lg p-6 shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative flex flex-col min-w-0 p-4 bg-white rounded-lg shadow" onClick={() => openModal(<OverallEngagementRateChart />)}>
                            <OverallEngagementRateChart />
                        </div>
                        <div className="relative flex flex-col min-w-0 p-4 bg-white rounded-lg shadow" onClick={() => openModal(<MenteeEngagementRatesChart />)}>
                            <MenteeEngagementRatesChart />
                        </div>
                        <div className="relative flex flex-col min-w-0 p-4 bg-white rounded-lg shadow" onClick={() => openModal(<BoardStagePieChart />)}>
                            <BoardStagePieChart />
                        </div>
                        {/* Placeholder for additional charts */}
                        {/* <div className="relative flex flex-col min-w-0 p-4 bg-white rounded-lg shadow" onClick={() => openModal(<BoardCompletionRateChart />)}>
                            <BoardCompletionRateChart />
                        </div> */}
                        <div className="relative flex flex-col min-w-0 p-4 bg-white rounded-lg shadow" onClick={() => openModal(<BoardCompletionRatesByStageChart />)}>
                            <BoardCompletionRatesByStageChart />
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {modalContent}
                </CustomModal>
            )}
        </div>
    );
};

export default MenteeAnalysis;

