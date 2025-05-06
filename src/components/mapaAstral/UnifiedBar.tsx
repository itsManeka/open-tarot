import './styles/UnifiedBar.css'

interface UnifiedBarProps {
    data: { color?: string, label: string; value: number; icon: string }[];
    title: string;
}

export default function UnifiedBar({ data, title }: UnifiedBarProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="unifiedbar">
            <p className='unifiedbar-text'>{title}</p>
            <div className="unifiedbar-bar">
                {data.map((item, index) => {
                    const percent = (item.value / total) * 100;
                    return (
                        <div
                            key={index}
                            className="unifiedbar-bar-segment"
                            style={{
                                width: `${percent}%`,
                                backgroundColor: `${item.color}`
                            }}
                            data-snapshot-img="download"
                        >
                            <img className="unifiedbar-bar-icon" src={item.icon} />
                        </div>
                    );
                })}
            </div>
            <div className="unifiedbar-bar-labels">
                {data.map((item, index) => {
                    const percent = ((item.value / total) * 100).toFixed(0);
                    return (
                        <div
                            key={index}
                            className="unifiedbar-bar-label"
                            style={{ width: `${(item.value / total) * 100}%` }}
                        >
                            {percent}%
                        </div>
                    );
                })}
            </div>
            <div className='unifiedbar-section'>
                {data.map((item, index) => {
                    const percent = ((item.value / total) * 100).toFixed(0);
                    return (
                        <div key={index} className="unifiedbar-item-box">
                            <div className="unifiedbar-item"  data-snapshot-img="download">
                                <img className="unifiedbar-icon" src={item.icon} />
                            </div>
                            <div className="unifiedbar-item all">
                                {item.label}
                            </div>
                            <div className="unifiedbar-item">
                                {percent}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
